import express from 'express';
import exphbs from 'express-handlebars';

const app = express();
const PORT = 3000;

// configure handlebars
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// routes
app.get("/", (req, res) => {
    res.render("home", { title: "Home page", isAdmin: true });
});

app.get("/about", (req, res) => {
    res.render("about", { 
        title: "About page", 
        users: [
            { name: "Alice", age: 30, role: "admin" },
            { name: "Bob", age: 25, role: "user" },
            { name: "Charlie", age: 35, role: "user" },
            { name: "Tomiwa", age: 22, role: "moderator" }
        ] 
    });
});


app.get("/products", (req, res) => {
    res.render("products", { 
        title: "Products Page",
        products: [
            { id: 1, name: "Laptop", price: 999, category: "Electronics", inStock: true },
            { id: 2, name: "Headphones", price: 700, category: "Audio", inStock: true },
            { id: 3, name: "Keyboard", price: 200, category: "Accessories", inStock: false },
            { id: 4, name: "Mouse", price: 300, category: "Accessories", inStock: true },
            { id: 5, name: "Monitor", price: 600, category: "Electronics", inStock: true }
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});