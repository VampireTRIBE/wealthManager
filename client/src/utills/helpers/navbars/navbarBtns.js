export const navbarBtns = ({
  userData,
  navigate,
  handleLogout,
  buttonStyle,
}) => {
  if (!userData?.categories) return [];
  return [
    ...userData.categories.map((cat, i) => ({
      text: cat.Name.toUpperCase(),
      className: buttonStyle,
      dis: i,
      onClick: () => navigate(`/${cat.Name.toLowerCase()}`),
    })),
    {
      text: "LogOut",
      className: buttonStyle,
      onClick: handleLogout,
      dis: userData.categories.length,
    },
  ];
};

export const subnavbarBtns = ({ category, navigate, buttonStyle }) => {
  if (!category?.subCategories) return [];

  const buttons = category.subCategories.map((subCat) => ({
    text: subCat.Name.toUpperCase(),
    className: buttonStyle,
    onClick: () => navigate(`/assets/${subCat.Name}`),
  }));
  return buttons;
};
