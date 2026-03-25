import { Response } from 'express';
import { Deposit } from '../../models/Deposit';
import { User } from '../../models/User';
import { AdminSettings } from '../../models/AdminSettings';
import { Transaction } from '../../models/Transaction';
import { AuthRequest } from '../../types';
import { AppError } from '../../utils/errors';
import { config } from '../../config';
import { convertToUSD } from '../../utils/coingecko';

export const getDepositAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get crypto addresses from admin settings
    let settings = await AdminSettings.findOne({});

    // If no settings exist, use defaults from config
    if (!settings) {
      settings = await AdminSettings.create({
        cryptoAddresses: config.crypto,
      });
    }

    const addresses = settings.cryptoAddresses || config.crypto;
    const qrCodeImages = (settings as any).qrCodeImages || {};

    res.status(200).json({
      success: true,
      data: {
        BTC: addresses.btc || config.crypto.btc,
        ETH: addresses.eth || config.crypto.eth,
        USDT_ERC20: addresses.usdtErc20 || config.crypto.usdtErc20,
        USDT_TRC20: addresses.usdtTrc20 || config.crypto.usdtTrc20,
        XMR: addresses.xmr || config.crypto.xmr,
        minimumDeposit: settings.minimumDeposit || 10,
        qrCodeImages: {
          BTC: qrCodeImages.btc || "",
          ETH: qrCodeImages.eth || "",
          USDT_ERC20: qrCodeImages.usdtErc20 || "",
          USDT_TRC20: qrCodeImages.usdtTrc20 || "",
          XMR: qrCodeImages.xmr || "",
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

export const createDeposit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currency, amount, txHash, usdAmount: frontendUsdAmount } = req.body;
    const userId = req.user?.userId!;

    // Get the appropriate wallet address
    let settings = await AdminSettings.findOne({});
    if (!settings) {
      settings = await AdminSettings.create({
        cryptoAddresses: config.crypto,
      });
    }

    const addresses = settings.cryptoAddresses || config.crypto;

    const addressMap: Record<string, string> = {
      BTC: addresses.btc || config.crypto.btc,
      ETH: addresses.eth || config.crypto.eth,
      USDT_ERC20: addresses.usdtErc20 || config.crypto.usdtErc20,
      USDT_TRC20: addresses.usdtTrc20 || config.crypto.usdtTrc20,
      XMR: addresses.xmr || config.crypto.xmr,
    };

    const walletAddress = addressMap[currency];

    if (!walletAddress) {
      throw new AppError('Deposit address not configured for this currency', 400);
    }

    // Use USD amount from frontend if provided, otherwise convert
    let usdAmount = 0;
    if (frontendUsdAmount && frontendUsdAmount > 0) {
      // Use the USD amount calculated by frontend
      usdAmount = frontendUsdAmount;
    } else {
      // Fallback: Auto-convert using CoinGecko API
      try {
        usdAmount = await convertToUSD(currency, amount);
      } catch (error) {
        console.error('Error converting to USD:', error);
        // Continue with zero USD amount if conversion fails
      }
    }

    // Create deposit record
    const deposit = await Deposit.create({
      userId,
      currency,
      amount,
      txHash,
      walletAddress,
      status: 'pending',
      usdAmount, // Store the USD amount
    });

    res.status(201).json({
      success: true,
      message: 'Deposit submitted successfully. Awaiting admin approval.',
      data: deposit,
    });
  } catch (error) {
    throw error;
  }
};

export const getMyDeposits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId!;
    const { status, limit = 20, skip = 0 } = req.query;

    const query: any = { userId };
    if (status) {
      query.status = status;
    }

    const deposits = await Deposit.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Deposit.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        deposits,
        total,
        limit: Number(limit),
        skip: Number(skip),
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getDepositById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId!;

    const deposit = await Deposit.findOne({ _id: id, userId });

    if (!deposit) {
      throw new AppError('Deposit not found', 404);
    }

    res.status(200).json({
      success: true,
      data: deposit,
    });
  } catch (error) {
    throw error;
  }
};
