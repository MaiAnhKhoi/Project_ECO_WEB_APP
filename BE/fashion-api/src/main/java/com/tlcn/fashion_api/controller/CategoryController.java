package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.entity.product.Category;
import com.tlcn.fashion_api.service.product.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * GET /api/categories/roots
     * -> Men / Women / Giày (parent_id IS NULL)
     */
    @GetMapping("/roots")
    public List<Category> getRootCategories() {
        return categoryService.getRootCategories();
    }

    /**
     * GET /api/categories?parent_id=1
     * -> lấy danh sách category con của parent
     */
    @GetMapping
    public List<Category> getByParent(
            @RequestParam(name = "parent_id", required = false) Long parentId
    ) {
        if (parentId == null) {
            // tuỳ bạn, có thể trả empty hoặc tất cả
            return categoryService.getRootCategories();
        }
        return categoryService.getChildren(parentId);
    }

    /**
     * GET /api/categories/{slug}/children
     * -> nếu bạn muốn gọi theo slug parent (optional)
     */
    @GetMapping("/{slug}/children")
    public List<Category> getChildrenBySlug(@PathVariable String slug) {
        return categoryService.getChildrenByParentSlug(slug);
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleRuntime(RuntimeException ex) {
        return ex.getMessage();
    }
}