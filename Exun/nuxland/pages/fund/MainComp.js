import Head from "next/head";
import WalletFallback from "../../components/WalletFallback";
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite } from "wagmi";

import { contract_address, ABI } from "../../ContractDetails"
import { useEffect } from "react";


export default function MainComp() {

    const { isConnected } = useAccount();

    const { data: AllEntityData, isError: AllEntityIsError, isLoading: AllEntityIsLoading } = useContractRead({
        address: contract_address,
        abi: ABI,
        functionName: 'getAllEntity',
    })
    // --------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------
    const { data: MyEntityData, isError: MyEntityIsError, isLoading: MyEntityIsLoading } = useContractRead({
        address: contract_address,
        abi: ABI,
        functionName: 'getMyEntity',
    })
    // --------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------
    const { data: MyEntityFundsData, isError: MyEntityFundsIsError, isLoading: MyEntityFundsIsLoading } = useContractRead({
        address: contract_address,
        abi: ABI,
        functionName: 'getEntityFunds',
    })
    // --------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------
    const { config: addEntityConfig, error: addEntityError } = usePrepareContractWrite({
        address: contract_address,
        abi: ABI,
        functionName: 'addEntity',
        args: [target * (10 ** 18)],
    })
    const { writeAsync: addEntityWriteAsync, data: addEntityData } = useContractWrite(addEntityConfig)
    const { isLoading: addEntityIsLoading, isSuccess: addEntityIsSuccess } = useWaitForTransaction({
        hash: addEntityData?.hash,
    })
    // --------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------
    const { config: stopFundraisingConfig, error: stopFundraisingError } = usePrepareContractWrite({
        address: contract_address,
        abi: ABI,
        functionName: 'stopFundraising',
    })
    const { writeAsync: stopFundraisingWriteAsync, data: stopFundraisingData } = useContractWrite(stopFundraisingConfig)
    const { isLoading: stopFundraisingIsLoading, isSuccess: stopFundraisingIsSuccess } = useWaitForTransaction({
        hash: stopFundraisingData?.hash,
    })
    // --------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------
    const { config: restartFundraisingConfig, error: restartFundraisingError } = usePrepareContractWrite({
        address: contract_address,
        abi: ABI,
        functionName: 'restartFundraising',
    })
    const { writeAsync: restartFundraisingWriteAsync, data: restartFundraisingData } = useContractWrite(restartFundraisingConfig)
    const { isLoading: restartFundraisingIsLoading, isSuccess: restartFundraisingIsSuccess } = useWaitForTransaction({
        hash: restartFundraisingData?.hash,
    })
    // --------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------
    const { config: sendFundsConfig, error: sendFundsError } = usePrepareContractWrite({
        address: contract_address,
        abi: ABI,
        functionName: 'sendFunds',
        args: [{ value: (1 * 10 ** 18) }]
    })
    const { writeAsync: sendFundsWriteAsync, data: sendFundsData } = useContractWrite(sendFundsConfig)
    const { isLoading: sendFundsIsLoading, isSuccess: sendFundsIsSuccess } = useWaitForTransaction({
        hash: sendFundsData?.hash,
    })
    // --------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------
    const { config: withdrawFundsConfig, error: withdrawFundsError } = usePrepareContractWrite({
        address: contract_address,
        abi: ABI,
        functionName: 'withdrawFunds',
    })
    const { writeAsync: withdrawFundsWriteAsync, data: withdrawFundsData } = useContractWrite(withdrawFundsConfig)
    const { isLoading: withdrawFundsIsLoading, isSuccess: withdrawFundsIsSuccess } = useWaitForTransaction({
        hash: withdrawFundsData?.hash,
    })
    // --------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------



    return (
        <>
            <Head>
                <title>Nuxland | Fund</title>
            </Head>
            <div style={{ height: "100vh", width: "100vw" }} className="wrapper">
                {
                    isConnected
                        ? <div>

                        </div>
                        : <WalletFallback />
                }
            </div>
        </>
    )
}