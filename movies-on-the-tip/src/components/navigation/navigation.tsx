import { NavLink } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import NavItems from './constants/nav-items';

export default function Navigation() {
    return (
        <Navbar
            className="mb-3"
            expand="md"
            bg="light"
            variant="light"
            collapseOnSelect
        >
            <Container fluid>
                <Navbar.Brand>Movies</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className="w-100 justify-content-end">
                        {
                            NavItems.map(navItem => (
                                <Nav.Link
                                    key={navItem.url}
                                    eventKey={navItem.url}
                                    to={navItem.url}
                                    as={NavLink}
                                >
                                    {navItem.label}
                                </Nav.Link>
                            ))
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}