import { useEffect, useState } from "react";
import "./DisplayPosts.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 
import { Container, Card, Form, Button, ListGroup, Navbar, Nav } from "react-bootstrap"; // Import Navbar and Nav
import { useNavigate } from "react-router-dom"; 

function DisplayPosts() {
  const [posts, setPosts] = useState([]);
  const [postDescription, setPostDescription] = useState("");
  const [user, setUser] = useState(null); // State to store the logged-in user's details
  const navigate = useNavigate(); // For navigation

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
        const userRes = await axios.get(`http://localhost:5000/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
    };

    try {
      const res = await axios.post("http://localhost:5000/chat/create", newPost, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts([res.data, ...posts]); // Add the new post at the top of the list
      setPostDescription("");
    } catch (error) {
      console.log("Error posting new post", error);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("auth-token"); // Remove the token from localStorage
    navigate("/login"); // Redirect to the login page
  };

  return (
    <>
      {/* Navbar with Logout Button */}
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Chat App</Navbar.Brand>
          <Nav className="me-auto">
          {user && (
            <Nav.Link onClick={() => navigate(`/profile/${user._id}`)}>Profile</Nav.Link>
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
                        <p className="mb-0">{post.message}</p>
                      </div>
                      <small className="text-muted">
                        {new Date(post.createdAt).toLocaleString()}
                      </small>
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