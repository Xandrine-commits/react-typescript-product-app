interface ProductProps {
    id: number;
    name: string;
    price: number;
    onProductSelected: (name: string) => void;
}

function Product({ name, price, onProductSelected }: ProductProps) {
    function handleClick() {
        onProductSelected(name);
        
    }

    function formatPrice(price: number) {
        return `$${price.toFixed(2)}`;
    }
    
    return (
        <li>
    <strong>{name}</strong>
    <p>Price: {formatPrice(price)}</p>
    <button onClick={handleClick}>
        Select Product
    </button>
</li>
    );
}


export default Product;