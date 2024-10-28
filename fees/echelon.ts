import fetchURL from "../utils/fetchURL";
import { SimpleAdapter } from "../adapters/types";
import { CHAIN } from "../helpers/chains";

const thalaDappURL = "https://app.echelon.market";
const feesQueryURL = `${thalaDappURL}/api/defillama/fees?timeframe=`;

interface IVolumeall {
  value: number;
  timestamp: string;
}

const feesEndpoint = (endTimestamp: number, timeframe: string) =>
  endTimestamp
    ? feesQueryURL + timeframe + `&endTimestamp=${endTimestamp}`
    : feesQueryURL + timeframe;

const fetch = async (timestamp: number) => {
  const dayFeesQuery = (await fetchURL(feesEndpoint(timestamp, "1D")))?.data;
  const dailyFees = dayFeesQuery.reduce(
    (partialSum: number, a: IVolumeall) => partialSum + a.value,
    0
  );

  const totalFeesQuery = (await fetchURL(feesEndpoint(0, "ALL")))?.data;
  const totalFees = totalFeesQuery.reduce(
    (partialSum: number, a: IVolumeall) => partialSum + a.value,
    0
  );

  return {
    totalFees: `${totalFees}`,
    dailyFees: `${dailyFees}`,
    timestamp,
  };
};

const adapter: SimpleAdapter = {
  adapter: {
    [CHAIN.APTOS]: {
      fetch,
      start: async () => 1680480000,
    },
  },
};

export default adapter;
