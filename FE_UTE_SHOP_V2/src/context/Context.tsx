"use client";
import { openCartModal } from "@/utlis/openCartModal";
import type { Product, ContextValue, ContextProps } from "@/types";
import type { CartItem, CartVariantOptionResponse } from "@/types/cart";
import React, { useEffect, useContext, useState } from "react";
import wishlistApi from "@/services/wishlistApi";
import cartApi from "@/services/cartApi";
import productApi from "@/services/productApi";
import type { VariantOption } from "@/types/cart";

const dataContext = React.createContext<ContextValue | undefined>(undefined);

export const useContextElement = (): ContextValue => {
  const context = useContext(dataContext);
  if (!context)
    throw new Error("useContextElement must be used within a Context provider");
  return context;
};

// ✅ helper tính tổng
const calcTotal = (items: CartItem[] | undefined | null): number => {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, i) => {
    // nếu sau này có discountedPrice thì sửa ở đây 1 chỗ là xong
    const unitPrice = Number(i.price || 0);
    return sum + unitPrice * (i.quantity || 0);
  }, 0);
};

export default function Context({ children }: ContextProps) {
  // 🛒 CART
  const [cartProducts, setCartProducts] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // 🔍 Quick View / Compare / Wishlist
  const [compareItem, setCompareItem] = useState<number[]>([]);
  const [quickViewItem, setQuickViewItem] = useState<Product>();
  const [quickAddItem, setQuickAddItem] = useState<number>(1);
  const [wishList, setWishList] = useState<number[]>([]);
  const [wishListLength, setWishListLength] = useState<number>(0);

  // ✅ Login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [prevLoggedIn, setPrevLoggedIn] = useState<boolean>(false);

  // luôn sync totalPrice theo cartProducts
  useEffect(() => {
    setTotalPrice(calcTotal(cartProducts));
  }, [cartProducts]);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(Boolean(token));
    };
    checkLogin();

    const handleStorageChange = () => checkLogin();
    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(checkLogin, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // ---------------------- WISHLIST (BE) ----------------------
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchWishlist = async () => {
      try {
        const res = await wishlistApi.getWishlist(0, 100);
        const ids = res.data.content.map((p: Product) => p.id);
        setWishList(ids);
        setWishListLength(ids.length);
      } catch {
        setWishList([]);
        setWishListLength(0);
      }
    };
    fetchWishlist();
  }, [isLoggedIn]);

  // ---------------------- COMPARE (localStorage) ----------------------
  useEffect(() => {
    const localCompareStr = localStorage.getItem("compare");
    if (localCompareStr) {
      try {
        const ids = JSON.parse(localCompareStr) as number[];
        setCompareItem(ids);
      } catch {
        setCompareItem([]);
      }
    } else {
      setCompareItem([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("compare", JSON.stringify(compareItem));
  }, [compareItem]);

  // ---------------------- MERGE CART SAU LOGIN ----------------------
  const mergeCartAfterLogin = async () => {
    if (!isLoggedIn) return;
    const localCartStr = localStorage.getItem("cart");
    if (!localCartStr) return;

    const localCart = JSON.parse(localCartStr) as CartItem[];
    if (localCart.length === 0) return;

    for (const item of localCart) {
      try {
        await cartApi.addToCart({
          productId: item.productId,
          quantity: item.quantity,
          variantId: item.variantId ?? undefined,
          color: item.color ?? undefined,
        });
      } catch (error) {
        console.error("Failed to merge cart item:", item.productId, error);
      }
    }

    localStorage.removeItem("cart");

    try {
      const res = await cartApi.getMyCart();
      const items = (res.data.items as CartItem[]) ?? [];
      setCartProducts(items);
    } catch (error) {
      console.error("Failed to fetch cart after login:", error);
    }
  };

  // ---------------------- LOAD CART ----------------------
  useEffect(() => {
    const fetchCart = async () => {
      if (!isLoggedIn) {
        // Chưa login -> từ localStorage + enrich
        const localCartStr = localStorage.getItem("cart");
        if (localCartStr) {
          try {
            const items = JSON.parse(localCartStr) as CartItem[];

            const enrichedItemsPromises = items.map(async (item) => {
              try {
                const productRes = await productApi.getProductDetail(
                  item.productId
                );
                const productData = productRes.data;

                let imgSrc = productData.imgSrc;
                if (item.color && productData.colors) {
                  const colorData = productData.colors.find(
                    (c: any) =>
                      c.label === item.color || c.value === item.color
                  );
                  if (colorData) {
                    imgSrc =
                      (colorData as any).imageUrl ||
                      colorData.img ||
                      imgSrc;
                  }
                }

                // ✅ Build variantOptions từ product colors và sizes
                let variantOptions: CartVariantOptionResponse[] = [];
                
                // Nếu item đã có variantOptions (từ localStorage), normalize nó
                if (item.variantOptions && item.variantOptions.length > 0) {
                  variantOptions = item.variantOptions.map((opt: any) => {
                    // Nếu có label (format từ VTON), parse thành color và size
                    if (opt.label && !opt.color) {
                      const parts = opt.label.split(" - ");
                      const colorPart = parts[0]?.trim() || "";
                      const sizePart = parts[1]?.trim() || null;
                      const normalized = {
                        variantId: opt.variantId || 0,
                        color: colorPart || null,
                        size: sizePart || null,
                        price: opt.price || productData.basePrice || productData.price || item.price || 0,
                        maxQuantity: opt.maxQuantity || productData.quantity || 999,
                        imageUrl: opt.imageUrl || null,
                      };
                      return normalized;
                    }
                    // Nếu đã có color và size, giữ nguyên nhưng đảm bảo có đủ field
                    const normalized = {
                      variantId: opt.variantId || 0,
                      color: opt.color || null,
                      size: opt.size || null,
                      price: opt.price || productData.basePrice || productData.price || item.price || 0,
                      maxQuantity: opt.maxQuantity || productData.quantity || 999,
                      imageUrl: opt.imageUrl || null,
                    };
                    return normalized;
                  });
                }
                
                // Nếu chưa có variantOptions, build từ product data
                if (variantOptions.length === 0 && productData.colors && Array.isArray(productData.colors)) {
                  productData.colors.forEach((color: any) => {
                    if (color.sizes && Array.isArray(color.sizes)) {
                      color.sizes.forEach((size: any) => {
                        variantOptions.push({
                          variantId: size.variantId || 0,
                          color: color.label || null,
                          size: size.size || null,
                          price: productData.basePrice || productData.price || 0,
                          maxQuantity: size.stockQuantity || 0,
                          imageUrl: color.img || color.imageUrl || productData.imgSrc || null,
                        });
                      });
                    } else {
                      // Nếu không có sizes, vẫn thêm color option
                      variantOptions.push({
                        variantId: 0,
                        color: color.label || null,
                        size: null,
                        price: productData.basePrice || productData.price || 0,
                        maxQuantity: productData.quantity || 999,
                        imageUrl: color.img || color.imageUrl || productData.imgSrc || null,
                      });
                    }
                  });
                }

                return {
                  ...item,
                  productSlug:
                    (productData as any).slug ||
                    `product-${productData.id}`,
                  productName: productData.title,
                  imgSrc,
                  maxQuantity: productData.quantity || 999,
                  variantOptions: variantOptions,
                  size: item.size || null,
                } as CartItem;
              } catch (error) {
                console.error(
                  `Failed to fetch product ${item.productId}:`,
                  error
                );
                return item;
              }
            });

            const enrichedItems = await Promise.all(enrichedItemsPromises);
            setCartProducts(enrichedItems);
          } catch (error) {
            console.error("Failed to load cart from localStorage:", error);
            setCartProducts([]);
          }
        } else {
          setCartProducts([]);
        }
        setPrevLoggedIn(false);
        return;
      }

      // Đã login -> BE
      try {
        const res = await cartApi.getMyCart();
        const items = (res.data.items as CartItem[]) ?? [];
        setCartProducts(items);
      } catch {
        setCartProducts([]);
      }
    };

    fetchCart();
  }, [isLoggedIn]);

  // ---------------------- MERGE CART KHI VỪA LOGIN ----------------------
  useEffect(() => {
    if (isLoggedIn && !prevLoggedIn) {
      mergeCartAfterLogin();
      setPrevLoggedIn(true);
    } else if (!isLoggedIn) {
      setPrevLoggedIn(false);
    }
  }, [isLoggedIn, prevLoggedIn]);

  // ---------------------- LƯU CART LOCAL KHI CHƯA LOGIN ----------------------
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("cart", JSON.stringify(cartProducts));
    }
  }, [cartProducts, isLoggedIn]);

  // ---------------------- CHECK TRONG CART ----------------------
  const isAddedToCartProducts = (
    productId: number,
    variantId?: number | null
  ) =>
    cartProducts.some(
      (i) =>
        i.productId === productId &&
        (variantId == null || i.variantId === variantId)
    );

  // ---------------------- ADD TO CART ----------------------
  const addProductToCart = (
    productId: number,
    qty: number = 1,
    isModal: boolean = true,
    variantId?: number | null,
    color?: string | null
  ) => {
    if (!isLoggedIn) {
      // GUEST: cart local
      (async () => {
        try {
          const productRes = await productApi.getProductDetail(productId);
          const productData = productRes.data;

          let imgSrc = productData.imgSrc;
          if (color && productData.colors) {
            const colorData = productData.colors.find(
              (c: any) => c.label === color || c.value === color
            );
            if (colorData) {
              imgSrc =
                (colorData as any).imageUrl ||
                colorData.img ||
                imgSrc;
            }
          }

          // ✅ Build variantOptions từ product colors và sizes
          const variantOptions: CartVariantOptionResponse[] = [];
          if (productData.colors && Array.isArray(productData.colors)) {
            productData.colors.forEach((colorItem: any) => {
              if (colorItem.sizes && Array.isArray(colorItem.sizes)) {
                colorItem.sizes.forEach((sizeItem: any) => {
                  variantOptions.push({
                    variantId: sizeItem.variantId || 0,
                    color: colorItem.label || null,
                    size: sizeItem.size || null,
                    price: productData.basePrice || productData.price || 0,
                    maxQuantity: sizeItem.stockQuantity || 0,
                    imageUrl: colorItem.img || colorItem.imageUrl || productData.imgSrc || null,
                  });
                });
              } else {
                // Nếu không có sizes, vẫn thêm color option
                variantOptions.push({
                  variantId: 0,
                  color: colorItem.label || null,
                  size: null,
                  price: productData.basePrice || productData.price || 0,
                  maxQuantity: productData.quantity || 999,
                  imageUrl: colorItem.img || colorItem.imageUrl || productData.imgSrc || null,
                });
              }
            });
          }

          setCartProducts((prev) => {
            const index = prev.findIndex(
              (i) =>
                i.productId === productId &&
                (i.variantId ?? null) === (variantId ?? null) &&
                (i.color ?? null) === (color ?? null)
            );

            if (index !== -1) {
              // ✅ không mutate trực tiếp
              const newArr = [...prev];
              const oldItem = newArr[index];
              newArr[index] = {
                ...oldItem,
                quantity: (oldItem.quantity || 0) + qty,
                // ✅ Cập nhật variantOptions nếu chưa có
                variantOptions: oldItem.variantOptions && oldItem.variantOptions.length > 0 
                  ? oldItem.variantOptions 
                  : variantOptions,
              };
              return newArr;
            }

            const newItem: CartItem = {
              id: Date.now(), // chỉ dùng local
              productId: productData.id,
              productSlug:
                (productData as any).slug ||
                `product-${productData.id}`,
              productName: productData.title,
              variantId: variantId ?? null,
              color: color ?? null,
              size: null,
              imgSrc,
              quantity: qty,
              price: productData.price,
              maxQuantity: productData.quantity || 999,
              variantOptions: variantOptions, // ✅ Dùng variantOptions đã build
            };

            return [...prev, newItem];
          });

          if (isModal) openCartModal();
        } catch (error) {
          console.error("Failed to fetch product:", productId, error);
          alert("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!");
        }
      })();
      return;
    }

    // LOGIN: BE
    (async () => {
      try {
        const res = await cartApi.addToCart({
          productId,
          quantity: qty,
          variantId: variantId ?? undefined,
          color: color ?? undefined,
        });
        const items = (res.data.items as CartItem[]) ?? [];
        setCartProducts(items);
        if (isModal) openCartModal();
      } catch {
        console.error("Failed to add to cart");
      }
    })();
  };

  // ---------------------- UPDATE QUANTITY ----------------------
  const removeItemFromCart = (itemId: number) => {
    if (!isLoggedIn) {
      setCartProducts((prev) => prev.filter((i) => i.id !== itemId));
      return;
    }

    (async () => {
      try {
        const res = await cartApi.removeItem(itemId);
        const items = (res.data.items as CartItem[]) ?? [];
        setCartProducts(items);
      } catch {
        console.error("Failed to remove cart item");
      }
    })();
  };

  const updateQuantity = (itemId: number, qty: number) => {
    if (qty <= 0) {
      removeItemFromCart(itemId);
      return;
    }

    if (!isLoggedIn) {
      setCartProducts((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, quantity: qty } : i
        )
      );
      return;
    }

    (async () => {
      try {
        const res = await cartApi.updateItem(itemId, { quantity: qty });
        const items = (res.data.items as CartItem[]) ?? [];
        setCartProducts(items);
      } catch {
        console.error("Failed to update cart item");
      }
    })();
  };

  // ---------------------- WISHLIST ----------------------
  const addToWishlist = (id: number) => {
    if (!wishList.includes(id)) {
      setWishList((prev) => {
        const newList = [...prev, id];
        setWishListLength(newList.length);
        return newList;
      });
      if (isLoggedIn) wishlistApi.addToWishlist(id).catch(console.error);
    } else {
      setWishList((prev) => {
        const newList = prev.filter((el) => el !== id);
        setWishListLength(newList.length);
        return newList;
      });
      if (isLoggedIn) wishlistApi.removeFromWishlist(id).catch(console.error);
    }
  };

  const removeFromWishlist = (id: number) => {
    if (wishList.includes(id)) {
      setWishList((prev) => {
        const newList = prev.filter((el) => el !== id);
        setWishListLength(newList.length);
        return newList;
      });
      if (isLoggedIn) wishlistApi.removeFromWishlist(id).catch(console.error);
    }
  };

  // ---------------------- COMPARE ----------------------
  const addToCompareItem = (id: number) => {
    if (compareItem.includes(id)) {
      alert("Sản phẩm đã có trong danh sách so sánh");
      return;
    }

    if (compareItem.length >= 10) {
      alert(
        "Bạn chỉ có thể so sánh tối đa 10 sản phẩm. Vui lòng xóa một sản phẩm trước khi thêm mới."
      );
      return;
    }

    setCompareItem((prev) => [...prev, id]);
  };

  const removeFromCompareItem = (id: number) => {
    setCompareItem((prev) => prev.filter((el) => el !== id));
  };

  const clearCompare = () => {
    setCompareItem([]);
  };

  const isAddedtoWishlist = (id: number) => wishList.includes(id);
  const isAddedtoCompareItem = (id: number) => compareItem.includes(id);


    // ---------------------- CHANGE VARIANT ----------------------
  const changeCartItemVariant = (itemId: number, option: VariantOption) => {
    if (!isLoggedIn) {
      // 🧾 GUEST: cập nhật trong state (effect bên dưới sẽ tự lưu vào localStorage)
      setCartProducts((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? {
                ...i,
                variantId: option.variantId,
                color: option.color ?? i.color,
                size: option.size ?? i.size,
                price: option.price,            // đổi giá theo biến thể
                maxQuantity: option.maxQuantity // nếu muốn giới hạn theo stock variant
                // có thể update imgSrc nếu BE trả imageUrl cho variant
                // imgSrc: option.imageUrl ?? i.imgSrc,
              }
            : i
        )
      );
      return;
    }

    // 👤 LOGIN: gọi BE đổi variant
    (async () => {
      try {
        const res = await cartApi.changeItemVariant(itemId, option.variantId);
        const items = (res.data.items as CartItem[]) ?? [];
        setCartProducts(items);
      } catch (error) {
        console.error("Failed to change cart item variant:", error);
      }
    })();
  };


  // ---------------------- EXPORT CONTEXT ----------------------
  const contextElement: ContextValue = {
    cartProducts,
    setCartProducts,
    totalPrice,
     changeCartItemVariant,
    addProductToCart,
    isAddedToCartProducts,
    updateQuantity,
    removeItemFromCart,

    removeFromWishlist,
    addToWishlist,
    isAddedtoWishlist,
    wishList,
    wishListLength,

    quickViewItem,
    setQuickViewItem,
    quickAddItem,
    setQuickAddItem,

    addToCompareItem,
    isAddedtoCompareItem,
    removeFromCompareItem,
    clearCompare,
    compareItem,
    setCompareItem,

    mergeCartAfterLogin,
  };

  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
