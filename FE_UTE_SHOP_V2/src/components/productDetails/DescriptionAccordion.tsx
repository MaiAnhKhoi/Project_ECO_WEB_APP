// src/components/productDetails/DescriptionAccordion.tsx
import Description from "./Description";
import Material from "./Material";
import ReturnPolicies from "./ReturnPolicies";
import AdditionalInfo from "./AdditionalInfo";
import Reviews from "./Reviews";
import type { ProductTabsResponse } from "@/types/product";

type DescriptionAccordionProps = {
  tabs: ProductTabsResponse | null;
};

export default function DescriptionAccordion({ tabs }: DescriptionAccordionProps) {
  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        {/* Descriptions */}
        <div className="widget-accordion wd-product-descriptions">
          <div
            className="accordion-title collapsed"
            data-bs-target="#description"
            data-bs-toggle="collapse"
            aria-expanded="true"
            aria-controls="description"
            role="button"
          >
            <span>Mô tả</span>
            <span className="icon icon-arrow-down" />
          </div>
          <div id="description" className="collapse">
            <div className="accordion-body widget-desc">
              <Description data={tabs?.description ?? null} />
            </div>
          </div>
        </div>

        {/* Materials */}
        <div className="widget-accordion wd-product-descriptions">
          <div
            className="accordion-title collapsed"
            data-bs-target="#material"
            data-bs-toggle="collapse"
            aria-expanded="true"
            aria-controls="material"
            role="button"
          >
            <span>Chất liệu</span>
            <span className="icon icon-arrow-down" />
          </div>
          <div id="material" className="collapse">
            <div className="accordion-body widget-material">
              <Material data={tabs?.materials ?? null} />
            </div>
          </div>
        </div>

        {/* Return Policies (nếu sau này dùng lại thì mở ra) */}
        {/* <div className="widget-accordion wd-product-descriptions">
          <div
            className="accordion-title collapsed"
            data-bs-target="#returnPolicies"
            data-bs-toggle="collapse"
            aria-expanded="true"
            aria-controls="returnPolicies"
            role="button"
          >
            <span>Return Policies</span>
            <span className="icon icon-arrow-down" />
          </div>
          <div id="returnPolicies" className="collapse">
            <div className="accordion-body">
              <ReturnPolicies />
            </div>
          </div>
        </div> */}

        {/* Additional Information */}
        <div className="widget-accordion wd-product-descriptions">
          <div
            className="accordion-title collapsed"
            data-bs-target="#additionalInfo"
            data-bs-toggle="collapse"
            aria-expanded="true"
            aria-controls="additionalInfo"
            role="button"
          >
            <span>Thông tin bổ sung</span>
            <span className="icon icon-arrow-down" />
          </div>
          <div id="additionalInfo" className="collapse">
            <div className="accordion-body">
              <AdditionalInfo items={tabs?.additionalInfo ?? []} />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="widget-accordion wd-product-descriptions">
          <div
            className="accordion-title collapsed"
            data-bs-target="#reviews"
            data-bs-toggle="collapse"
            aria-expanded="true"
            aria-controls="reviews"
            role="button"
          >
            <span>Đánh giá</span>
            <span className="icon icon-arrow-down" />
          </div>
          <div id="reviews" className="collapse">
            <div className="accordion-body wd-customer-review">
              <Reviews data={tabs?.reviews ?? null} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
