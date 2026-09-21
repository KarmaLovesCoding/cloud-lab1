const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require ("./student.model");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
    dbName: "cloud_lab"
})
    .then(() => {
        console.log("MongoDB connected to cloud_lab");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });


app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách sinh viên",
            error: error.message
        });
    }
});

app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json(student);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi khi thêm sinh viên",
            error: error.message
        });
    }
});

app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi cập nhật sinh viên",
            error: error.message
        });
    }
});

app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json({
            message: "Xóa sinh viên thành công",
            student
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi xóa sinh viên",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
