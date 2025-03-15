import { useEffect, useState } from "react";
import "./DisplayPosts.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Container,
  Card,
  Form,
  Button,
  ListGroup,
  Navbar,
  Nav,
} from "react-bootstrap"; // Import Navbar and Nav
import { useNavigate } from "react-router-dom";

function DisplayPosts() {
  const [posts, setPosts] = useState([]);
  const [postDescription, setPostDescription] = useState("");
  const [image, setImage] = useState(""); // State to store the image file
  const [user, setUser] = useState(null); // State to store the logged-in user's details
  const [isEditing, setIsEditing] = useState(false); // State to check if the user is editing a post
  const [editingPostId, setEditingPostId] = useState(null); // State to store the ID of the post being edited
  const [editPostDescription, setEditPostDescription] = useState(""); // State to store the edited post description
  const navigate = useNavigate(); // For navigation

  // Function to handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      setImage(reader.result); // This is the base64 string
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Fetch all posts from the database
  const getAllPosts = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const res = await axios.get("http://localhost:5000/chat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (error) {
      console.log("Error fetching posts", error);
    }
  };

  // Fetch the logged-in user's details
  const fetchUserDetails = async () => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      try {
        // Decode the token to get the user's _id
        const decoded = jwtDecode(token);
        const userId = decoded._id;

        // Fetch the user's details from the backend
        const userRes = await axios.get(
          `http://localhost:5000/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(userRes.data); // Store the user's details in state
      } catch (error) {
        console.log("Error fetching user details", error);
      }
    }
  };

  useEffect(() => {
    getAllPosts();
    fetchUserDetails(); // Fetch user details when the component mounts
  }, []);

  const handleAddPost = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("auth-token");
    if (!user) {
      console.log("User not found");
      return;
    }

    const newPost = {
      message: postDescription,
      sender: user.name, // Use the user's name as the sender
      image: image
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/chat/create",
        newPost,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPosts([res.data, ...posts]); // Add the new post at the top of the list
      setPostDescription("");
    } catch (error) {
      console.log("Error posting new post", error);
    }
  };

  async function deletePost(postId) {
    try {
      if (window.confirm("Are you sure you want to delete this post?")) {
        const token = localStorage.getItem("auth-token");
        let response = await axios.delete(
          `http://localhost:5000/chat/delete/${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert(response.data.message);
        console.log("Post deleted", response.data);
        getAllPosts();
      }
    } catch (error) {
      console.log("Error deleting post", error);
    }
  }

  // Edit post function
  const handleEditPost = async (e, postId) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("auth-token");
      await axios.put(`http://localhost:5000/chat/update/${postId}`, 
        { message: editPostDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, message: editPostDescription } : post
      ));
      setEditingPostId(null);
    } catch (error) {
      console.log("Error updating post", error);
    }
  };
  

  //Handle Click on Edit Button
  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setEditPostDescription(post.message);

  };
  


  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("auth-token"); // Remove the token from localStorage
    navigate("/login"); // Redirect to the login page
  };

  //Function to delete a post
  async function deletePost(postId) {
    try {
      if (window.confirm("Are you sure you want to delete this post?")) {
        const token = localStorage.getItem("auth-token");
        let response = await axios.delete(
          `http://localhost:5000/chat/delete/${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert(response.data.msg);
        console.log("Post deleted", response.data);
        getAllPosts();
      }
    } catch (error) {
      console.log("Error deleting post", error);
    }
  }

  return (
    <>
      {/* Navbar with Logout Button */}
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Chat App</Navbar.Brand>
          <Nav className="me-auto">
            {user && (
              <Nav.Link onClick={() => navigate(`/profile/${user._id}`)}>
                Profile
              </Nav.Link>
            )}
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="mt-5">
        <Card className="shadow">
          <Card.Body>
            <Card.Title className="text-center mb-4">Make a Post</Card.Title>
            <Form onSubmit={handleAddPost}>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter post description"
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  required
                />
                  <Form.Group className="mb-3">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Form.Group>
              <div className="d-grid">
                <Button variant="primary" type="submit">
                  Submit Post
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        <Card className="mt-4 shadow">
          <Card.Body>
            <Card.Title className="text-center mb-4">Posts</Card.Title>
            {posts.length === 0 ? (
              <p className="text-center">No posts available</p>
            ) : (
              <ListGroup>
                {posts.map((post) => (
  <ListGroup.Item key={post._id} className="mb-3 shadow-sm">
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <strong>{post.sender}</strong>
        {editingPostId === post._id ? (
          <Form onSubmit={(e) => handleEditPost(e, post._id)}>
            <Form.Control
              type="text"
              value={editPostDescription}
              onChange={(e) => setEditPostDescription(e.target.value)}
              required
            />
            <Button variant="success" type="submit" size="sm" className="mt-2">
              Save
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="mt-2 ms-2"
              onClick={() => setEditingPostId(null)}
            >
              Cancel
            </Button>
          </Form>
        ) : (
          <p className="mb-0">{post.message}</p>
        )}
        {post.image && <img src={post.image} alt="post" className="post-image" />}
      </div>
       {/* Time and Buttons Section */}
       <div className="d-flex flex-column align-items-end">
        {/* Post Timestamp Positioned at Top */}
        <small className="text-muted mb-2">
          {new Date(post.createdAt).toLocaleString()}
        </small>

        {/* Edit and Delete Buttons Positioned Below Time */}
        {user && post.senderId === user._id && (
          <div>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEditClick(post)}
              className="mb-2 mb-md-0 me-md-2"
            >
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => deletePost(post._id)}
            >
              Delete
            </Button>
            </div>
        )}
      </div>
    </div>
  </ListGroup.Item>
))}

              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default DisplayPosts;
