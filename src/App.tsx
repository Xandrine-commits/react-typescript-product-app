import { useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import ApiUser from "./ApiUser";
import Product from "./Product";

interface ApiUserData {
    id: number;
    name: string;
    email: string;
}

interface ProductData {
    id: number;
    title: string;
    price: number;
}

function getTotalPages(
    totalItems: number,
    itemPerPage: number
): number {
    return Math.ceil(totalItems / itemPerPage)
}

function App() {
    const [showProfiles, setShowProfiles] = useState(true);

    const [formData, setFormData] = useState({
            name: "",
            email: ""
        });
    const [apiUsers, setApiUsers] = useState<ApiUserData[]>([]);
    const [products, setProducts] = useState<ProductData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("default");
    const [selectedProduct, setSelectedProduct ] = useState<ProductData | null>(null);
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [items, setItems] = useState<string[]>([]);
    const [newItem, setNewItem] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const filteredProducts = products.filter((product) =>
    product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    const totalPages = getTotalPages(
        filteredProducts.length,
        productsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortOrder]);

    useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }
    }, [currentPage, totalPages]);


    const startIndex = (currentPage - 1) * productsPerPage;

    const paginatedProducts = [...filteredProducts]
        .sort(sortProducts)
        .slice(startIndex, startIndex + productsPerPage)
    

    function addItem() {
        if (!newItem.trim()) {
            return;
        }

        setItems([...items, newItem.trim()]);
        setNewItem("");
    }

    useEffect(() => {
        
    }, [formData.name]);

    useEffect(() => {
    async function fetchUsers() {
        try {
            setProductsError("");

            const response = await fetch(
                "https://jsonplaceholder.typicode.com/users"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();

            setApiUsers(data);
            setLoading(false);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Something went wrong");
            }

            setLoading(false);
        }

    }

    fetchUsers();
}, [retryCount]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setProductsError("");

                const response = await fetch(
                    "https://dummyjson.com/products"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();

                
                setProducts(data.products);
                setProductsLoading(false);
            } catch (error) {
                if (error instanceof Error) {
                    setProductsError(error.message);
                } else {
                    setProductsError("Something went wrong");
                }

                setProductsLoading(false);
            }
        }

        fetchProducts();
    }, [retryCount]);

function handleUserSelected(userName: string) {
            setSelectedUser(userName);
        }

    function handleProductSelected(productName: string) {
    const product = products.find(
        (product) => product.title === productName
    );

    if (product) {
        setSelectedProduct(product);
    }
}

    function handleClearProduct() {
        setSelectedProduct(null);
    }

    function handleResetProducts() {
        setSearchTerm("");
        setSortOrder("default");
        setSelectedProduct(null);
        setCurrentPage(1);
    }

    function sortProducts(a: ProductData, b: ProductData) {
    if (sortOrder === "low-high") {
        return a.price - b.price;
    }

    if (sortOrder === "high-low") {
        return b.price - a.price;
    }

    if (sortOrder === "name-az") {
        return a.title.localeCompare(b.title);
    }

    if (sortOrder === "name-za") {
        return b.title.localeCompare(a.title);
    }

    return 0;
}

    function formatPrice(price: number) {
        return `$${price.toFixed(2)}`;
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if(!formData.name || !formData.email) {
            alert("Please fill in all fields");
            return;
        }

        alert(`Submitted: ${formData.name} - ${formData.email}`)

        setFormData({
            name: "",
            email: ""
        });
    }


    const users = [
        {
            username: "Xandrine",
            age: 30,
            isAdmin: true
        },
        {
            username: "John",
            age: 25,
            isAdmin: false
        },
        {
            username: "Maria",
            age: 28,
            isAdmin: false
        }
    ];

    function saveEdit() {
        if (editingIndex === null || !newItem.trim()) {
            return;
        }

        const updatedItems = [...items];
        updatedItems[editingIndex] = newItem.trim();

        setItems(updatedItems);
        setNewItem("");
        setEditingIndex(null);
    }

    return (
        <div>
            <h1>User Profiles</h1>

            <form onSubmit={handleSubmit}>
                <input
    type="text"
    placeholder="Enter your name"
    value={formData.name}
    onChange={(event) =>
        setFormData({
            ...formData,
            name: event.target.value
        })
    }
/>
                <input type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(event) =>
                    setFormData({
                        ...formData,
                        email: event.target.value
                    })
                }  />

                <button type="submit">
                    Submit
                </button>
            </form>

            <button onClick={addItem}>
                Add Item
            </button>
            <ul>
    {items.map((item, index) => (
        <li key={index}>
            {item}
            <button onClick={() => setItems(items.filter((_, i) => i !== index))}>
                delete
                </button>

                <button onClick={() => {
                    setEditingIndex(index);
                    setNewItem(item);
                    }}
                    >
                    Edit
                </button>
                </li>
    ))}

    {editingIndex !== null && (
        <>
        <input type="text"
        placeholder="Edit item"
        value={newItem}
        onChange={(event) => setNewItem(event.target.value)} 
        />

        <button onClick={saveEdit}>
            Save Edit
        </button>
        </>
        
    )}
</ul>

{editingIndex !== null && (
    <p>Editing item: {editingIndex}</p>

)}

<input type="text"
placeholder="Enter item"
value={newItem}
onChange={(event) => setNewItem(event.target.value)}
 />

            <p>Hello, {formData.name}</p>

            <button onClick={() => setShowProfiles(!showProfiles)}>
                {showProfiles ? "Hide Profiles" : "Show Profiles"}
            </button>

            {showProfiles && (
                <div>
                    {users.map((user) => (
                        <UserProfile
                            key={user.username}
                            username={user.username}
                            age={user.age}
                            isAdmin={user.isAdmin}
                        />
                    ))}
                </div>
            )}

            <h2>API Users</h2>

            {selectedUser && (
                <p>Selected User: {selectedUser}</p>
            )}

            {selectedUser && (
                <button onClick={() => setSelectedUser("")}>
                    Clear Selection
                </button>
            )}

            {loading ? (
              <p>Loading users...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              apiUsers.map((user) => (
        <ApiUser
            key={user.id}
            id={user.id}
            name={user.name}
            email={user.email}
            onUSerSelected={handleUserSelected}
        />

        
    ))

)}

         {selectedProduct && (
            <div>
                <h3>Selected Product</h3>
                <p>Name: {selectedProduct.title}</p>
                <p>Product ID:{selectedProduct.id}</p>
                <p>Price: {formatPrice(selectedProduct.price)}</p>

                <button onClick={handleClearProduct}>
                    Clear Selected Product
                </button>
            </div>
         )}
         <h2>Products</h2>

         <label htmlFor="product-search">Search products</label>

         <input 
             id="product-search"
             type="text"
             placeholder="Search products..."
             value={searchTerm}
             onChange={(event) => setSearchTerm(event.target.value)}
             disabled={productsLoading}
             onKeyDown={(event) => {
                if (event.key === "Escape") {
                    setSearchTerm("");
                }
             }} 
             />

             <select 
                 id="product-sort"
                 value={sortOrder}
                 onChange={(event) => setSortOrder(event.target.value)}
                 disabled={productsLoading}
             >
                <option value="default">Default Order</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="name-az">Name: A-Z</option>
                <option value="name-za">Name: Z-A</option>
             </select>

             <p>
                Current Sorting: {
                    sortOrder ==="low-high"
                        ? "Price: Low to High"
                        : sortOrder === "high-low"
                        ? "Price: High to Low"
                        : sortOrder === "name-az"
                        ? "Name: A-Z"
                        : sortOrder === "name-za"
                        ?"Name: Z-A"
                        : "Default Order"
                }
             </p>
             <button 
                onClick={handleResetProducts}
                disabled={
                    productsLoading ||
                    (
                        searchTerm === "" &&
                        sortOrder === "default" &&
                        selectedProduct === null
                    )
                }>
                Reset Products
             </button>

             {searchTerm && (
                <button onClick={() => setSearchTerm("")}>
                Clear Search
             </button>
             )}

             <p>
                Showing {filteredProducts.length} of {products.length} products
             </p>

         <p>Total Products: {products.length}</p>

         {productsLoading ? (
            <p>Loading products...</p>
        ) : productsError ? (
            <div>
                <p>Error: {productsError}</p>
                <button
                    onClick={() => {
                        setProductsError("");
                        setProductsLoading(true);
                        setRetryCount((count) => count + 1);
                    }}
                >
                    retry
                </button>
            </div>
        ) : (
            
        <>
        <ul>
            {filteredProducts.length === 0 ? (
        <li>No products found for "{searchTerm}".
            <button onClick={() => setSearchTerm("")}>
                Clear search
                </button>
                </li>
    ) : (
        paginatedProducts.map((product) => (
            <Product
                key={product.id}
                id={product.id}
                name={product.title}
                price={product.price}
                onProductSelected={handleProductSelected}
            />
        ))
    )}
        </ul>
        {!productsLoading && !productsError && filteredProducts.length > 0 && (
            <div>
            <button 
               onClick={() =>
    setCurrentPage((page) => Math.max(page - 1, 1))
}
                disabled={currentPage === 1}
                >
                    Previous
            </button>

            <span>
                {" "}Page {currentPage} of {Math.max(totalPages, 1)}{" "}
            </span>

            <button
    onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
    disabled={currentPage >= totalPages}
>
    Next
</button>
        </div>

        )}
        
    </>

        )}


        </div>
        

    )}
    


export default App;