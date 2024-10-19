import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";

const FooterCom = () => {
  return (
    <Footer container className="border border-t-5 border-gray-500 ">
      <div className="w-full max-w-7xl mx-auto">
        <div className="">
          <div className="">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Turbo
              </span>{" "}
              Tribune
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
            <Footer.Title title="Contact Us"/>
            <Footer.LinkGroup col>
                <Footer.Link href="https://ajmalksaleem.github.io/info/" target="_blank" rel="noopener noreferrer">Personal Website</Footer.Link>
                <Footer.Link href="https://www.linkedin.com/in/ajmalksaleem/" target="_blank" rel="noopener noreferrer">LinkedIn</Footer.Link>
                <Footer.Link href="https://github.com/ajmalksaleem" target="_blank" rel="noopener noreferrer">GitHub</Footer.Link>
            </Footer.LinkGroup>
            </div>
            <div>
            <Footer.Title title="Follow Me"/>
            <Footer.LinkGroup col>
                <Footer.Link href="#"  rel="noopener noreferrer">Instagram</Footer.Link>
                <Footer.Link href="#"  rel="noopener noreferrer">Facebook</Footer.Link>
                <Footer.Link href="#"  rel="noopener noreferrer">Twitter</Footer.Link>
            </Footer.LinkGroup>
            </div>
            <div>
            <Footer.Title title="Legal"/>
            <Footer.LinkGroup col>
                <Footer.Link href="#"  rel="noopener noreferrer">Privacy Policy</Footer.Link>
                <Footer.Link href="#"  rel="noopener noreferrer">Terms & Conditions</Footer.Link>
                <Footer.Link href="#"  rel="noopener noreferrer"></Footer.Link>
            </Footer.LinkGroup>
            </div>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterCom;
