"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import addressApi from "@/services/addressApi";
import type { AddressRequest, AddressResponse } from "@/types/address";

export default function Address() {
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const emptyForm: AddressRequest = {
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    city: "",
    region: "",
    province: "",
    phone: "",
    isDefault: false,
  };

  const [form, setForm] = useState<AddressRequest>(emptyForm);

  // ====== LOAD LIST ADDRESS LÚC VÀO TRANG ======
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const res = await addressApi.getMyAddresses();
        setAddresses(res.data);
      } catch (err) {
        console.error("Không thể tải danh sách địa chỉ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // ====== THÊM ĐỊA CHỈ ======
  const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await addressApi.createAddress(form);
      setAddresses((prev) => [...prev, res.data]);
      setForm(emptyForm);
      setShowAddForm(false);
    } catch (err) {
      console.error("Không thể thêm địa chỉ", err);
    } finally {
      setLoading(false);
    }
  };

  // ====== EDIT: LOAD LÊN FORM ======
  const handleEditAddress = (id: number) => {
    setEditingAddressId(id);
    const address = addresses.find((addr) => addr.id === id);
    if (address) {
      setForm({
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company || "",
        address1: address.address1,
        city: address.city,
        region: address.region,
        province: address.province || "",
        phone: address.phone,
        isDefault: address.isDefault,
      });
    }
  };

  // ====== UPDATE ĐỊA CHỈ ======
  const handleUpdateAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingAddressId === null) return;

    try {
      setLoading(true);
      const res = await addressApi.updateAddress(editingAddressId, form);
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === editingAddressId ? res.data : addr))
      );
      setEditingAddressId(null);
      setForm(emptyForm);
    } catch (err) {
      console.error("Không thể cập nhật địa chỉ", err);
    } finally {
      setLoading(false);
    }
  };

  // ====== XÓA ĐỊA CHỈ ======
  const handleDeleteAddress = async (id: number) => {
    try {
      setLoading(true);
      await addressApi.deleteAddress(id);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    } catch (err) {
      console.error("Không thể xóa địa chỉ", err);
    } finally {
      setLoading(false);
    }
  };

  // ====== HỦY EDIT ======
  const handleCancelEdit = () => {
    setEditingAddressId(null);
    setForm(emptyForm);
  };

  // ====== ĐẶT MẶC ĐỊNH ======
  const handleSetDefault = async (id: number) => {
    try {
      setLoading(true);
      const res = await addressApi.setDefault(id);
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === res.data.id,
        }))
      );
    } catch (err) {
      console.error("Không thể đặt địa chỉ mặc định", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flat-spacing-13">
      <div className="container-7">
        <div className="btn-sidebar-mb d-lg-none">
          <button data-bs-toggle="offcanvas" data-bs-target="#mbAccount">
            <i className="icon icon-sidebar" />
          </button>
        </div>

        <div className="main-content-account">
          <div className="sidebar-account-wrap sidebar-content-wrap sticky-top d-lg-block d-none">
            <ul className="my-account-nav">
              <Sidebar />
            </ul>
          </div>

          <div className="my-acount-content account-address">
            <h6 className="title-account">
              Địa chỉ của bạn ({addresses.length})
            </h6>

            {loading && <p>Đang tải...</p>}

            <div className="widget-inner-address">
              <button
                className="tf-btn btn-add-address animate-btn"
                onClick={() => {
                  setForm(emptyForm);
                  setShowAddForm(true);
                }}
              >
                Thêm địa chỉ mới
              </button>

              {/* ===== FORM THÊM ===== */}
              {showAddForm && (
                <form
                  onSubmit={handleAddAddress}
                  className="wd-form-address form-default show-form-address"
                  style={{ display: "block" }}
                >
                  <div className="cols">
                    <fieldset>
                      <label htmlFor="firstName">Họ</label>
                      <input
                        type="text"
                        id="firstName"
                        value={form.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </fieldset>
                    <fieldset>
                      <label htmlFor="lastName">Tên</label>
                      <input
                        type="text"
                        id="lastName"
                        value={form.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="cols">
                    <fieldset>
                      <label htmlFor="company">Công ty</label>
                      <input
                        type="text"
                        id="company"
                        value={form.company}
                        onChange={handleInputChange}
                      />
                    </fieldset>
                  </div>
                  <div className="cols">
                    <fieldset>
                      <label htmlFor="address1">Địa chỉ</label>
                      <input
                        type="text"
                        id="address1"
                        value={form.address1}
                        onChange={handleInputChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="cols">
                    <fieldset>
                      <label htmlFor="city">Thành phố</label>
                      <input
                        type="text"
                        id="city"
                        value={form.city}
                        onChange={handleInputChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="cols">
                    <fieldset>
                      <label htmlFor="region">Quốc gia/Vùng</label>
                      <input
                        type="text"
                        id="region"
                        value={form.region}
                        onChange={handleInputChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="cols">
                    <fieldset>
                      <label htmlFor="province">Tỉnh/Thành</label>
                      <input
                        type="text"
                        id="province"
                        value={form.province}
                        onChange={handleInputChange}
                      />
                    </fieldset>
                  </div>
                  <div className="cols">
                    <fieldset>
                      <label htmlFor="phone">Số điện thoại</label>
                      <input
                        type="text"
                        id="phone"
                        value={form.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="tf-cart-checkbox">
                    <input
                      type="checkbox"
                      name="isDefault"
                      className="tf-check"
                      id="isDefault"
                      checked={form.isDefault}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="isDefault" className="label">
                      <span>Đặt làm địa chỉ mặc định</span>
                    </label>
                  </div>
                  <div className="box-btn">
                    <button className="tf-btn animate-btn" type="submit">
                      Thêm địa chỉ
                    </button>
                    <button
                      type="button"
                      className="tf-btn btn-out-line-dark btn-hide-address"
                      onClick={() => setShowAddForm(false)}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}

              {/* ===== LIST ĐỊA CHỈ ===== */}
              <ul className="list-account-address tf-grid-layout md-col-2">
                {addresses.map((address) => (
                  <li className="account-address-item" key={address.id}>
                    <p className="title text-md fw-medium">
                      {address.address1}
                    </p>
                    <div className="info-detail">
                      <div className="box-infor">
                        <p className="text-md">
                          {address.firstName} {address.lastName}
                        </p>
                        {address.company && (
                          <p className="text-md">{address.company}</p>
                        )}
                        <p className="text-md">{address.address1}</p>
                        <p className="text-md">{address.city}</p>
                        <p className="text-md">{address.region}</p>
                        {address.province && (
                          <p className="text-md">{address.province}</p>
                        )}
                        <p className="text-md">{address.phone}</p>
                        <p className="text-md">
                          Mặc định: {address.isDefault ? "Có" : "Không"}
                        </p>
                      </div>
                      <div className="box-btn">
                        <button
                          className="tf-btn btn-out-line-dark btn-edit-address"
                          onClick={() => handleEditAddress(address.id)}
                        >
                          Sửa
                        </button>
                        <button
                          className="tf-btn btn-out-line-dark btn-delete-address"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          Xóa
                        </button>
                        {!address.isDefault && (
                          <button
                            className="tf-btn btn-out-line-dark"
                            onClick={() => handleSetDefault(address.id)}
                          >
                            Đặt làm mặc định
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* ===== FORM EDIT ===== */}
              {editingAddressId !== null && (
                <form
                  onSubmit={handleUpdateAddress}
                  className="wd-form-address form-default edit-form-address "
                  style={{ display: "block" }}
                >
                  <div className="cols">
                    <fieldset>
                      <label htmlFor="firstName">Họ</label>
                      <input
                        type="text"
                        id="firstName"
                        value={form.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </fieldset>
                    <fieldset>
                      <label htmlFor="lastName">Tên</label>
                      <input
                        type="text"
                        id="lastName"
                        value={form.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="cols">
                    <fieldset>
                      <label htmlFor="company">Công ty</label>
                      <input
                        type="text"
                        id="company"
                        value={form.company}
                        onChange={handleInputChange}
                      />
                    </fieldset>
                  </div>
                  <div className="cols">
                    <fieldset>
                      <label htmlFor="address1">Địa chỉ</label>
                      <input
                        type="text"
                        id="address1"
                        value={form.address1}
                        onChange={handleInputChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="cols">
                    <fieldset>
                      <label htmlFor="city">Thành phố</label>
                      <input
                        type="text"
                        id="city"
                        value={form.city}
                        onChange={handleInputChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="cols">
                    <fieldset>
                      <label htmlFor="region">Quốc gia/Vùng</label>
                      <input
                        type="text"
                        id="region"
                        value={form.region}
                        onChange={handleInputChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="cols">
                    <fieldset>
                      <label htmlFor="province">Tỉnh/Thành</label>
                      <input
                        type="text"
                        id="province"
                        value={form.province}
                        onChange={handleInputChange}
                      />
                    </fieldset>
                  </div>
                  <div className="cols">
                    <fieldset>
                      <label htmlFor="phone">Số điện thoại</label>
                      <input
                        type="text"
                        id="phone"
                        value={form.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="tf-cart-checkbox">
                    <input
                      type="checkbox"
                      name="isDefault"
                      className="tf-check"
                      id="isDefault"
                      checked={form.isDefault}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="isDefault" className="label">
                      <span>Đặt làm địa chỉ mặc định</span>
                    </label>
                  </div>
                  <div className="box-btn">
                    <button className="tf-btn animate-btn" type="submit">
                      Cập nhật
                    </button>
                    <button
                      type="button"
                      className="tf-btn btn-out-line-dark btn-hide-edit-address"
                      onClick={handleCancelEdit}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
