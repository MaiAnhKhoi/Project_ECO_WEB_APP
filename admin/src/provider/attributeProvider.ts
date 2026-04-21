// src/provider/attributeProvider.ts
import attributeApi from "../service/attributeApi";
import type {
  AttributeDto,
  CreateAttributeRequest,
} from "../type/attribute";
import { getPaginationFromUrl } from "../utils/pagination";

export const attributeProvider = {
  // ⚡ getList cho Refine (admin attributes)
  async getList(params: any) {
    const { pagination } = params;
    
    // 🔍 Lấy pagination từ URL
    const { current, pageSize } = getPaginationFromUrl(pagination);

    // BE: GET /api/admin/attributes  -> List<AttributeDto>
    const res = await attributeApi.getAll();

    const wrapped = res.data as { success: boolean; data: AttributeDto[] };
    const list: AttributeDto[] = wrapped.data ?? [];

    // vì BE không paging nên mình cắt client-side
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = list.slice(start, end);

    return {
      data: pageItems,
      total: list.length,
    };
  },

  // ⚡ getOne cho Refine (không có API riêng -> lấy từ getAll rồi find)
  async getOne(params: any) {
    const { id } = params;

    const res = await attributeApi.getAll();
    const wrapped = res.data as { success: boolean; data: AttributeDto[] };
    const list: AttributeDto[] = wrapped.data ?? [];

    const found = list.find((a) => a.id === Number(id));
    if (!found) {
      throw new Error("Attribute not found");
    }

    return {
      data: found,
    };
  },

  // ⚡ create attribute
  async create(params: any) {
    const payload = params.variables as CreateAttributeRequest;

    const res = await attributeApi.createAttribute(payload);
    const wrapped = res.data as { success: boolean; data: AttributeDto };

    return {
      data: wrapped.data,
    };
  },

  // ⚠️ hiện chưa có API update attribute, nếu sau này có PUT thì bổ sung
  async update(_params: any) {
    throw new Error("Update attribute is not supported by API yet");
  },

  // ⚡ delete attribute
  async deleteOne(params: any) {
    const { id } = params;

    await attributeApi.deleteAttribute(id);
    return {
      data: null as any,
    };
  },
};
