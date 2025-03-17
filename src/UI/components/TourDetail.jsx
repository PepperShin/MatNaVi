import { useState, useEffect } from "react";
import axios from "axios";
import { createAPIUrl } from "../../common/commonUrl";
import { xml2js } from "xml-js";

const TourDetail = ({contentId, setAreaCode, setSigunguCode}) => {
    const [detailData, setDetailData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getDetailInfo();
    }, [contentId])

    const setProps = async (data) => {
        setAreaCode(data.areacode);
        setSigunguCode(data.sigungucode);
    }

    const getDetailInfo = async () => {
        try {
            const response = await axios.get(createAPIUrl("detailCommon1", {
                contentId: contentId,
                firstImageYN: "Y",
                areacodeYN: "Y",
                addrinfoYN: "Y",
                mapinfoYN: "Y",
                overviewYN: "Y",
                defaultYN: "Y",
            }));

            if (response.data.response.header.resultMsg === 'OK') {
                setDetailData(response?.data.response.body.items.item[0]);
                await setProps(response?.data.response.body.items.item[0]);
            }
        } catch (error) {
            console.error("API 요청 실패:", error);
            setError("API 요청 실패 ", error.message);
        }
    }

    return (
        <div style={{display:'flex', flexDirection:'row', gap:10}}>
            {/* {error && <p>{error}</p>} */}

            <div style={{display:'flex', width: "50%"}}>
                <img style={{width:'100%'}} src={detailData?.firstimage} alt={detailData?.title} />
            </div>
            <div style={{display:'flex', width: "50%", flexDirection:'column', gap:10}}>
                <h2>{detailData?.title}</h2>
                <span style={{width:'100%'}}>{detailData?.overview}</span>
            </div>
        </div>
    )
}
export default TourDetail;