interface ApiUserProps {
    id: number;
    name: string;
    email: string;
    onUSerSelected: (name: string) => void;
}



function ApiUser({ id, name, email, onUSerSelected }: ApiUserProps) {

    function handleClick() {
    onUSerSelected(name);
}

    return (
        <div>
            <h3>{name}</h3>
            <p>{email}</p>
            <p>ID: {id}</p>

            <button onClick={handleClick}>
                Select USer
            </button>
        </div>
    );
}

export default ApiUser;