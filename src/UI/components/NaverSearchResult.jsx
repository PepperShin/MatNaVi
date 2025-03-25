const NaverSearchResult = (datas) => {
  return (
    <div>
      <ul className="list-group">
        {datas.datas.map((arr) => (
          <li className="my-1 list-group-item">
            <h4>{arr.title}</h4>
            <div>{arr.address}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NaverSearchResult;
