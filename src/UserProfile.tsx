import { useState } from "react";

interface UserProfileProps {
    username: string;
    age: number;
    isAdmin: boolean;
}

function UserProfile({ username, age, isAdmin }: UserProfileProps) {
     const [likes, setLikes] = useState(0);

    function handleLike() {
        setLikes(likes + 1);
    }

    return (
        <div>
            <h2>{username}</h2>
            <p>Age: {age}</p>
            <p>Role: {isAdmin ? "Admin" : "User"}</p>

            <button onClick={handleLike}>
                Likes: {likes}
            </button>
        </div>
    );
}

export default UserProfile;