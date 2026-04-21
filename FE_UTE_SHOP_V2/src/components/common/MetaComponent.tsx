// import { Helmet, HelmetProvider } from "react-helmet-async";

import { useEffect } from "react";
import type { MetaData } from "@/types";
import { getDefaultTitle } from "@/config/shop";

export default function MetaComponent({ meta }: { meta: MetaData }) {
  useEffect(() => {
    const updateMeta = async () => {
      document.title = meta.title || getDefaultTitle();
    };
    updateMeta();
    return () => {
      document.title = getDefaultTitle();
    };
  }, []);
  return (
    // <HelmetProvider>
    //   <Helmet>
    //     <title>{meta?.title}</title>
    //     <meta name="description" content={meta?.description} />
    //   </Helmet>
    // </HelmetProvider>

    <></>
  );
}
