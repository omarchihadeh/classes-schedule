import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Image, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavBar() {


    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand><Link to="/" className="navbar-brand">Schedule Classes App</Link></Navbar.Brand>
                <Nav.Link><Link to="/line" className="navbar-brand">Line Graph</Link></Nav.Link>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        Created By: Omar Chihadeh
                    </Navbar.Text>
                    &nbsp;
                    <Image src="logo.jpg" alt="Image description" width={155} height={75} />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;