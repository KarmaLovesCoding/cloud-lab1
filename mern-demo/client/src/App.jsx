import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [students, setStudents] = useState([]);

    const [studentId, setStudentId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    

    useEffect(() => {
    fetch("/api/students")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Không thể lấy danh sách sinh viên");
            }

            return response.json();
        })
        .then((data) => {
            setStudents(data);
        })
        .catch((error) => {
            console.error("Lỗi GET:", error);
        });
}, []);

    const addStudent = async (e) => {
        e.preventDefault();

        if (!studentId || !name || !email) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const newStudent = {
            studentId,
            name,
            email
        };

        try {
            const response = await fetch(
                "/api/students",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newStudent)
                }
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Không thể thêm sinh viên"
                );
            }

            setStudents((prevStudents) => [
                ...prevStudents,
                data
            ]);

            setStudentId("");
            setName("");
            setEmail("");

        } catch (error) {
            console.error("Lỗi POST:", error);

            alert(
                "Thêm sinh viên thất bại: " +
                error.message
            );
        }
    };

    return (
        <div className="app">

            {/* HEADER */}
            <header className="header">
                <div>
                    <p className="subtitle">STUDENT MANAGEMENT SYSTEM</p>
                    <h1>Quản lý sinh viên</h1>
                    <p className="description">
                        Quản lý thông tin sinh viên nhanh chóng và đơn giản
                    </p>
                </div>

                <div className="student-count">
                    <span>{students.length}</span>
                    <small>Sinh viên</small>
                </div>
            </header>

            {/* CONTENT */}
            <main className="container">

                {/* FORM */}
                <section className="card form-card">
                    <div className="card-title">
                        <div className="icon">+</div>

                        <div>
                            <h2>Thêm sinh viên</h2>
                            <p>Nhập thông tin sinh viên mới</p>
                        </div>
                    </div>

                    <form onSubmit={addStudent}>

                        <div className="form-group">
                            <label>Mã sinh viên</label>

                            <input
                                type="text"
                                placeholder="VD: SV003"
                                value={studentId}
                                onChange={(e) =>
                                    setStudentId(e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Họ và tên</label>

                            <input
                                type="text"
                                placeholder="Nguyen Van C"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>

                            <input
                                type="email"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />
                        </div>

                        <button type="submit">
                            <span>+</span>
                            Thêm sinh viên
                        </button>

                    </form>
                </section>

                {/* LIST */}
                <section className="card list-card">

                    <div className="card-title">
                        <div className="icon list-icon">☰</div>

                        <div>
                            <h2>Danh sách sinh viên</h2>
                            <p>
                                Danh sách sinh viên trong hệ thống
                            </p>
                        </div>
                    </div>

                    {students.length === 0 ? (
                        <div className="empty">
                            <div className="empty-icon">○</div>
                            <h3>Chưa có sinh viên</h3>
                            <p>
                                Hãy thêm sinh viên đầu tiên
                            </p>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>MSSV</th>
                                        <th>Họ và tên</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {students.map(
                                        (student, index) => (
                                            <tr key={student._id}>
                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <span className="student-id">
                                                        {
                                                            student.studentId
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {student.name}
                                                    </strong>
                                                </td>

                                                <td className="email">
                                                    {student.email}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                </section>

            </main>

            <footer>
                Student Management System • React + Express + MongoDB
            </footer>

        </div>
    );
}

export default App;