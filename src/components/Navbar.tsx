const Navbar: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <nav
      className={`sticky top-0 left-0 w-[60%] rounded-[4px] bg-blue-600 text-white p-4 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      Sticky Navbar
    </nav>
  );
};

export default Navbar;
