export const PopCoinDeploymentParameters: {
    [index: number]: {
        initVirtualEthReserve: number,
        createTokenFee: number,
        transactionFeePercent_x_100?: number,
        deployLiquidityFee: number        
    };
} = {
    31337: {
        initVirtualEthReserve: 10,
        createTokenFee: 0.005,
        transactionFeePercent_x_100: 100,
        deployLiquidityFee: 1.5
    },
    250: {// fantom
        initVirtualEthReserve: 73667,
        createTokenFee: 0,
        transactionFeePercent_x_100: 50,
        deployLiquidityFee: 10000
    },
    4002: {//Fantom-testnet
        initVirtualEthReserve: 73667,
        createTokenFee: 0,
        transactionFeePercent_x_100: 50,
        deployLiquidityFee: 10000
    },
    44787: {//Celo-testnet
        initVirtualEthReserve: 50000,
        createTokenFee: 0.01,
        transactionFeePercent_x_100: 100,
        deployLiquidityFee: 5000
    },
    1115: {//Core -testnet
        initVirtualEthReserve: 20000,
        createTokenFee: 0.01,
        transactionFeePercent_x_100: 100,
        deployLiquidityFee: 2750
    },

    656476: {//Open Campus Educhain -testnet
        initVirtualEthReserve: 60000,
        createTokenFee: 0.01,
        transactionFeePercent_x_100: 100,
        deployLiquidityFee: 2750
    },

}