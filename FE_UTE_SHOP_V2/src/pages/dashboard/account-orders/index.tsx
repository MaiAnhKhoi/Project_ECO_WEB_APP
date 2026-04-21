import Orders from "@/components/dashboard/Orders";
import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import OrderDetails from "@/components/modals/OrderDetails";

import MetaComponent from "@/components/common/MetaComponent";
import Breadcumb from "@/components/common/Breadcumb";
import { createPageMetadata } from "@/config/shop";
import { useState } from "react";

const metadata = createPageMetadata("Đơn hàng");
export default function AccountOrderPage() {

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Breadcumb pageName="Đơn hàng của tôi" pageTitle="Đơn hàng của tôi" />
      <Orders onViewDetail={setSelectedOrderId} />
      <Footer />
      {/* Modal chi tiết nhận orderId để load chi tiết */}
      <OrderDetails orderId={selectedOrderId} />
    </>
  );
}
