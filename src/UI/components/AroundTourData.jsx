import { Link } from "react-router-dom"

const AroundTourData = (datas) => {
  return (
    <div>
      <ul className="list-group">
        {datas.datas.map((arr) => (
          <li className="my-1 list-group-item">
            <Link to={`/tripinfo/${arr.contentid}`} key={arr.contentid} style={{ textDecoration: "none", color: "inherit" }}>
              <h4>{arr.title}</h4>
              <div>{arr.addr1}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AroundTourData