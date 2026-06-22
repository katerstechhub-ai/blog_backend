import express from 'express';
import exphbs from 'express-handlebars';

const app = express();
const PORT = 3000;

// Configure handlebars with custom helpers
const hbs = exphbs.create({
    defaultLayout: "main",
    helpers: {
        charAt: function(str, index) {
            if (!str) return '';
            return str.charAt(index);
        },
        isAdminRole: function(role) {
            return role === 'admin';
        },
        isModeratorRole: function(role) {
            return role === 'moderator';
        },
        isUserRole: function(role) {
            return role === 'user' || role === 'student';
        }
    }
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Sample student data
let students = [
    { id: 1, name: " Tomiwa", age: 20, grade: "A", course: "Computer Science", email: "Tomi@example.com" },
    { id: 2, name: "Liam ", age: 22, grade: "B+", course: "Mathematics", email: "liam@example.com" },
    { id: 3, name: "Daniella", age: 21, grade: "A-", course: "Physics", email: "Daniella@example.com" },
    { id: 4, name: " Hazard", age: 23, grade: "B", course: "Chemistry", email: "Hazard@example.com" },
    { id: 5, name: "Ragnar", age: 20, grade: "A+", course: "Computer Science", email: "Ragnar@example.com" },
    { id: 6, name: "Peter", age: 21, grade: "B-", course: "Engineering", email: "Peter@example.com" },
    { id: 7, name: "ava", age: 22, grade: "A", course: "Biology", email: "ava@example.com" }
];

// Role simulation - Change to false to see regular user view
const IS_ADMIN = true;

// Routes
app.get("/", (req, res) => {
    res.render("home", { title: "Home", isAdmin: IS_ADMIN });
});

app.get("/about", (req, res) => {
    res.render("about", { 
        title: "About", 
        isAdmin: IS_ADMIN,
        users: [
            { name: "Dr. Sarah Johnson", age: 42, role: "admin", department: "Administration" },
            { name: "Prof. Maurice Brown", age: 38, role: "moderator", department: "Computer Science" },
            { name: "Alice james", age: 28, role: "user", department: "Student Services" },
            { name: "Jasmine", age: 35, role: "moderator", department: "Mathematics" },
            { name: "Maria ", age: 31, role: "user", department: "Physics" }
        ] 
    });
});

// Admin Dashboard route (protected)
app.get("/admin/dashboard", (req, res) => {
    if (!IS_ADMIN) {
        return res.status(403).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Access Denied</title><link rel="stylesheet" href="/css/style.css"></head>
            <body style="display: flex; justify-content: center; align-items: center; min-height: 100vh;">
                <div style="background: #fff; padding: 3rem; border-radius: 20px; text-align: center; max-width: 400px;">
                    <i class="fas fa-lock" style="font-size: 48px; color: #C4593A;"></i>
                    <h1 style="font-family: 'Playfair Display', serif; margin: 1rem 0;">Access Denied</h1>
                    <p style="color: #7A6E65;">You don't have permission to view this page.</p>
                    <a href="/" style="display: inline-block; margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #C4593A; color: white; border-radius: 100px; text-decoration: none;">← Back to Home</a>
                </div>
            </body>
            </html>
        `);
    }
    res.render("admin", { 
        title: "Admin Dashboard",
        isAdmin: IS_ADMIN,
        students: students
    });
});

// API Routes for student management
app.get("/api/students", (req, res) => {
    if (!IS_ADMIN) return res.status(403).json({ error: "Unauthorized" });
    res.json(students);
});

app.post("/api/students", express.json(), (req, res) => {
    if (!IS_ADMIN) return res.status(403).json({ error: "Unauthorized" });
    
    const newStudent = {
        id: students.length + 1,
        name: req.body.name,
        age: parseInt(req.body.age),
        grade: req.body.grade,
        course: req.body.course,
        email: req.body.email
    };
    students.push(newStudent);
    res.json(newStudent);
});

app.put("/api/students/:id", express.json(), (req, res) => {
    if (!IS_ADMIN) return res.status(403).json({ error: "Unauthorized" });
    
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        students[index] = { ...students[index], ...req.body };
        res.json(students[index]);
    } else {
        res.status(404).json({ error: "Student not found" });
    }
});

app.delete("/api/students/:id", (req, res) => {
    if (!IS_ADMIN) return res.status(403).json({ error: "Unauthorized" });
    
    const id = parseInt(req.params.id);
    students = students.filter(s => s.id !== id);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`\n📚 StudentHub — Admin Dashboard`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✨ Server: http://localhost:${PORT}`);
    console.log(`🔐 Admin mode: ${IS_ADMIN ? "ON (full access)" : "OFF (view only)"}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});