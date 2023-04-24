import { PolicyId, Unit } from "lucid-cardano";
import React, { useContext, useState } from "react";
import {
    applyParamsToScript,
    Data,
    MintingPolicy,
    fromText,
} from "lucid-cardano";
import { AppStateContext } from "@/pages/_app";
import { signAndSubmitTx } from "@/utilities/utilities";

export default function DeployScripts() {
    const { appState, setAppState } = useContext(AppStateContext);
    const {
        lucid,
        wAddr,
        oracleScript,
        collateralScript,
        txScriptsDeployment,
        txCollScriptDeployment,
        txMintingPolScriptDeployment,
    } = appState;
    const [mPerc, setMPerc] = useState(150n);

    const parseMinPerc = (r: string) => {
        const mPerc = BigInt(Number(r));
        if (Number.isNaN(mPerc)) return;
        setMPerc(mPerc);
    };

    const getFinalMintingPolicy = async () => {
        if (!lucid || !wAddr || !oracleScript || !mPerc) return;
        const tn = fromText("USDP");
        const oracleValidatorHash = await lucid.utils.validatorToScriptHash(
            oracleScript
        );
        const collateralValidatorHash = await lucid.utils.validatorToScriptHash(
            collateralScript
        );

        console.log("Applying minting script to these parameters: ", {
            OracleValHash: oracleValidatorHash,
            CollateralValHash: collateralValidatorHash,
            minPercent: mPerc,
        });

        const Params = Data.Tuple([Data.Bytes(), Data.Bytes(), Data.Integer()]);
        type Params = Data.Static<typeof Params>;
        const scPolicy: MintingPolicy = {
            type: "PlutusV2",
            script: applyParamsToScript<Params>(
                "5909065909030100003233223322323232323232323232323232323232323232323232222223232533532323232325335533533355300d12001323212330012233350052200200200100235001220011233001225335002102610010232325335333573466e3cd400488008d401c880080940904ccd5cd19b87350012200135007220010250241024350012200235500122222222222200c10231335738921115554784f206e6f7420636f6e73756d65640002215335533532330215026001355001222222222222008102222135002222533500415335333573466e3c0080240a009c4ccd5cd19b87001480080a009c409c8840a4408c4cd5ce24811377726f6e6720616d6f756e74206d696e746564000221022135001220023333573466e1cd55cea802a4000466442466002006004646464646464646464646464646666ae68cdc39aab9d500c480008cccccccccccc88888888888848cccccccccccc00403403002c02802402001c01801401000c008cd406c070d5d0a80619a80d80e1aba1500b33501b01d35742a014666aa03eeb94078d5d0a804999aa80fbae501e35742a01066a03604a6ae85401cccd5407c099d69aba150063232323333573466e1cd55cea801240004664424660020060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40c1d69aba150023031357426ae8940088c98c80cccd5ce01a01981889aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a8183ad35742a00460626ae84d5d1280111931901999ab9c034033031135573ca00226ea8004d5d09aba2500223263202f33573806005e05a26aae7940044dd50009aba1500533501b75c6ae854010ccd5407c0848004d5d0a801999aa80fbae200135742a00460486ae84d5d1280111931901599ab9c02c02b029135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a00a60266ae84d5d1280291931900e99ab9c01e01d01b3333573466e1cd55ce9baa0064800080708c98c8070cd5ce00e80e00d1bae00633011375c00e6eb401840644c98c8064cd5ce2490350543500019135573ca00226ea8004c8004d5406488448894cd40044d400c88004884ccd401488008c010008ccd54c01c4800401401000448c88c008dd6000990009aa80c911999aab9f0012501b233501a30043574200460066ae8800804c8c8c8cccd5cd19b8735573aa004900011991091980080180118051aba150023005357426ae8940088c98c804ccd5ce00a00980889aab9e5001137540024646464646666ae68cdc39aab9d5004480008cccc888848cccc00401401000c008c8c8c8cccd5cd19b8735573aa0049000119910919800801801180a1aba1500233500d013357426ae8940088c98c8060cd5ce00c80c00b09aab9e5001137540026ae854010ccd54021d728039aba150033232323333573466e1d4005200423212223002004357426aae79400c8cccd5cd19b875002480088c84888c004010dd71aba135573ca00846666ae68cdc3a801a400042444006464c6403466ae7006c06806005c0584d55cea80089baa00135742a00466a012eb8d5d09aba2500223263201433573802a02802426ae8940044d5d1280089aab9e500113754002266aa002eb9d6889119118011bab00132001355016223233335573e0044a032466a03066442466002006004600c6aae754008c014d55cf280118021aba200301113574200224464646666ae68cdc3a800a40004642446004006600a6ae84d55cf280191999ab9a3370ea0049001109100091931900899ab9c01201100f00e135573aa00226ea80048c8c8cccd5cd19b875001480188c848888c010014c020d5d09aab9e500323333573466e1d40092004232122223002005300a357426aae7940108cccd5cd19b875003480088c848888c004014c01cd5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900899ab9c01201100f00e00d00c135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011980298031aba15002375a6ae84d5d1280111931900699ab9c00e00d00b135573ca00226ea80048848cc00400c0088c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c8028cd5ce00580500409baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c804ccd5ce00a00980880800780700680600589aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6401866ae700340300280244d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200933573801401200e00c26aae7540044dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6401466ae7002c02802001c0184d55cea80089baa0012323333573466e1d40052002200a23333573466e1d40092000200a23263200633573800e00c00800626aae74dd5000a4c24002921035054310032001355006222533500110022213500222330073330080020060010033200135500522225335001100222135002225335333573466e1c005200000a0091333008007006003133300800733500b12333001008003002006003122002122001112200212212233001004003112323001001223300330020020011",
                [oracleValidatorHash, collateralValidatorHash, mPerc],
                Params
            ),
        };
        const scPolicyId: PolicyId = lucid!.utils.mintingPolicyToId(scPolicy);

        const unit: Unit = scPolicyId + tn;
        setAppState({
            ...appState,
            scPolicyIdHex: scPolicyId,
            scTokenNameHex: tn,
            scAssetClassHex: unit,
            scPolicy: scPolicy,
            minPercent: Number(mPerc),
        });

        return scPolicy;
    };

    const deployBothScriptsInOneTx = async () => {
        if (!lucid || !wAddr || txScriptsDeployment) return;
        console.log("deployBothScriptsInOneTx -> appState: ", appState);
        const scPolicy = await getFinalMintingPolicy();
        if (!scPolicy) return;
        const tx = await lucid
            .newTx()
            .payToAddressWithData(
                wAddr,
                { inline: Data.void(), scriptRef: collateralScript },
                {}
            )
            .payToAddressWithData(
                wAddr,
                { inline: Data.void(), scriptRef: scPolicy },
                {}
            )
            .complete();

        const pid = await signAndSubmitTx(tx);
        console.log("Deployed both scripts: ", pid);
        setAppState({ ...appState, txScriptsDeployment: pid });
    };

    return (
        <div>
            <div className="flex flex-row">
                <p>Minimum Percentage of Collateral:</p>
                <input
                    type="number"
                    value={Number(mPerc)}
                    onChange={(e) => parseMinPerc(e.target.value)}
                />
            </div>
            <button
                onClick={deployBothScriptsInOneTx}
                disabled={
                    !wAddr ||
                    !oracleScript ||
                    !mPerc ||
                    !!txCollScriptDeployment ||
                    !!txMintingPolScriptDeployment
                }
                className="bg-blue-500 disabled:bg-slate-300 hover:bg-orange-700 text-white font-bold p-2 m-4 rounded"
            >
                {" "}
                Deploy Scripts
            </button>
        </div>
    );
}
