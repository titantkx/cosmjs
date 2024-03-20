/* eslint-disable @typescript-eslint/naming-convention */
import { AminoMsg, Coin } from "@cosmjs/amino";
import { Decimal } from "@cosmjs/math";
import { MsgFundRewardPool, MsgSetAuthority, MsgSetRate } from "cosmjs-types/titan/validatorreward/tx";

import { AminoConverter } from "../..";

function protoDecimalToJson(decimal: string): string {
  const parsed = Decimal.fromAtomics(decimal, 18);
  const [whole, fractional] = parsed.toString().split(".");
  return `${whole}.${(fractional ?? "").padEnd(18, "0")}`;
}

function jsonDecimalToProto(decimal: string): string {
  const parsed = Decimal.fromUserInput(decimal, 18);
  return parsed.atomics;
}

/** Sets interest rate. */
export interface AminoMsgSetRate extends AminoMsg {
  readonly type: "validatorreward/MsgSetRate";
  readonly value: {
    authority: string;
    rate: string;
  };
}

export function isAminoMsgSetRate(msg: AminoMsg): msg is AminoMsgSetRate {
  return msg.type === "validatorreward/MsgSetRate";
}

/** Sets reward pool's authority. */
export interface AminoMsgSetAuthority extends AminoMsg {
  readonly type: "validatorreward/MsgSetAuthority";
  readonly value: {
    authority: string;
    new_authority: string;
  };
}

export function isAminoMsgSetAuthority(msg: AminoMsg): msg is AminoMsgSetAuthority {
  return msg.type === "validatorreward/MsgSetAuthority";
}

/** Funds reward pool. */
export interface AminoMsgFundRewardPool extends AminoMsg {
  readonly type: "validatorreward/MsgFundRewardPool";
  readonly value: {
    depositor: string;
    amount: Coin[];
  };
}

export function isAminoMsgFundRewardPool(msg: AminoMsg): msg is AminoMsgFundRewardPool {
  return msg.type === "validatorreward/MsgFundRewardPool";
}

export function createValidatorRewardAminoConverters(): Record<string, AminoConverter> {
  return {
    "/titan.validatorreward.MsgSetRate": {
      aminoType: "validatorreward/MsgSetRate",
      toAmino: ({ authority, rate }: MsgSetRate): AminoMsgSetRate["value"] => {
        return {
          authority: authority,
          rate: protoDecimalToJson(rate),
        };
      },
      fromAmino: ({ authority, rate }: AminoMsgSetRate["value"]): MsgSetRate => ({
        authority: authority,
        rate: jsonDecimalToProto(rate),
      }),
    },
    "/titan.validatorreward.MsgSetAuthority": {
      aminoType: "validatorreward/MsgSetAuthority",
      toAmino: ({ authority, newAuthority }: MsgSetAuthority): AminoMsgSetAuthority["value"] => {
        return {
          authority: authority,
          new_authority: newAuthority,
        };
      },
      fromAmino: ({ authority, new_authority }: AminoMsgSetAuthority["value"]): MsgSetAuthority => ({
        authority: authority,
        newAuthority: new_authority,
      }),
    },
    "/titan.validatorreward.MsgFundRewardPool": {
      aminoType: "validatorreward/MsgFundRewardPool",
      toAmino: ({ depositor, amount }: MsgFundRewardPool): AminoMsgFundRewardPool["value"] => {
        return {
          depositor: depositor,
          amount: amount,
        };
      },
      fromAmino: ({ depositor, amount }: AminoMsgFundRewardPool["value"]): MsgFundRewardPool => ({
        depositor: depositor,
        amount: amount,
      }),
    },
  };
}
