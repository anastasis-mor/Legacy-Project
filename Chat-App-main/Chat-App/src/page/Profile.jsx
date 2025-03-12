import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Container, Card, Button, ListGroup, Navbar, Nav } from "react-bootstrap"; // Import Navbar and Nav here
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null); // State to store the user's details
  const [loading, setLoading] = useState(true); // Loading state to show a loading indicator
  const navigate = useNavigate(); // For navigation

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
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.log("Error fetching user details", error);
        setLoading(false); // Set loading to false in case of an error
      }
    }
  };

  useEffect(() => {
    fetchUserDetails(); // Fetch user details when the component mounts
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth-token"); // Remove the token from localStorage
    navigate("/login"); // Redirect to the login page
  };

  const handleHomeRedirect = () => {
    navigate("/chat"); // Redirect to the DisplayPosts page
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while data is being fetched
  }

  if (!user) {
    return <div>User not found</div>; // Show an error message if no user data is found
  }

  return (
    <>
      {/* Navbar with Home and Logout buttons */}
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand onClick={handleHomeRedirect} style={{ cursor: 'pointer' }}>
            Home
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Profile Content */}
      <Container className="mt-5">
        <Card className="shadow">
          <Card.Body>
            <Card.Title className="text-center mb-4">Profile</Card.Title>
            <ListGroup>
              <ListGroup.Item>
                <strong>Name:</strong> {user.name}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Email:</strong> {user.email}
              </ListGroup.Item>
            </ListGroup>
            <div className="d-grid mt-4">
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Profile;
