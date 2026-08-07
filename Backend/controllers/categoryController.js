const Category = require("../models/Category");

// =======================
// Create Category
// =======================
const createCategory = async (req, res) => {
    try {
        const { category_name, icon } = req.body;

        if (!category_name) {
            return res.status(400).json({
                message: "Category name is required",
                error: true,
            });
        }

        const checkCategory = await Category.findOne({
            where: { category_name },
        });

        if (checkCategory) {
            return res.status(400).json({
                message: "Category already exists",
                error: true,
            });
        }

        const category = await Category.create({
            category_name,
            icon,
        });

        return res.status(201).json({
            message: "Category created successfully",
            error: false,
            data: category,
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: true,
        });
    }
};

// =======================
// Get All Categories
// =======================
const getAllCategories = async (req, res) => {
    try {

        const categories = await Category.findAll({
            order: [["category_name", "ASC"]],
        });

        return res.status(200).json({
            message: "Categories fetched successfully",
            error: false,
            total: categories.length,
            data: categories,
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: true,
        });
    }
};

// =======================
// Get Category By Id
// =======================
const getCategoryById = async (req, res) => {
    try {

        const { id } = req.params;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                error: true,
            });
        }

        return res.status(200).json({
            message: "Category fetched successfully",
            error: false,
            data: category,
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: true,
        });
    }
};

// =======================
// Update Category
// =======================
const updateCategory = async (req, res) => {

    try {

        const { id } = req.params;
        const { category_name, icon } = req.body;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                error: true,
            });
        }

        if (category_name) {

            const exists = await Category.findOne({
                where: { category_name },
            });

            if (exists && exists.category_id != id) {
                return res.status(400).json({
                    message: "Category name already exists",
                    error: true,
                });
            }

            category.category_name = category_name;
        }

        if (icon !== undefined) {
            category.icon = icon;
        }

        await category.save();

        return res.status(200).json({
            message: "Category updated successfully",
            error: false,
            data: category,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: true,
        });

    }

};

// =======================
// Delete Category
// =======================
const deleteCategory = async (req, res) => {

    try {

        const { id } = req.params;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                error: true,
            });
        }

        await category.destroy();

        return res.status(200).json({
            message: "Category deleted successfully",
            error: false,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: true,
        });

    }

};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};