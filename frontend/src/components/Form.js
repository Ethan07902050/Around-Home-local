import React, { useState, useEffect } from "react";
import axios from "axios";
import API_KEY from "../key";
import { fetchAQI, fetchUV } from "../fetch/fetchEnvironment";
import {
  fetchGreen,
  fetchGarbage,
  fetchClothes,
  fetchDisposal,
  fetchReward,
} from "../fetch/fetchEco";
import { fetchTheft, fetchAccident } from "../fetch/fetchSafety";

const Form = ({
  address,
  setAddress,
  showContent,
  setShowContent,
  lat,
  setLat,
  lng,
  setLng,
  distanceRange,
  setDistanceRange,
  timeRange,
  setTimeRange,
  setAQIRowData,
  setUVRowData,
  setWQIRowData,
  setGreenResLoc,
  setGreenResRowData,
  setGreenStoreLoc,
  setGreenStoreRowData,
  setRewardResLoc,
  setRewardResRowData,
  setGarbageRowData,
  setGarbageLoc,
  setClothesRowData,
  setClothesLoc,
  setDisposalRowData,
  setDisposalLoc,
  setTheftRowData,
  setAccidentRowData,
  setTheftLoc,
  setAccidentLoc,
}) => {
  let [url, setUrl] = useState("");
  const [error, setError] = useState(null);

  const inputHandler = (e) => {
    setAddress(e.target.value);
  };

  const onclickEnvironment = (e) => {
    e.preventDefault();
    e.target.classList.toggle("checked");
    determineShow(0);
  };
  const onclickEco = (e) => {
    e.preventDefault();
    e.target.classList.toggle("checked");
    determineShow(1);
  };
  const onclickSafety = (e) => {
    e.preventDefault();
    e.target.classList.toggle("checked");
    determineShow(2);
  };

  const determineShow = (index) => {
    if (showContent[index] === false) {
      let tempShowContent = JSON.parse(JSON.stringify(showContent));
      tempShowContent[index] = true;
      setShowContent(tempShowContent);
    } else {
      let tempShowContent = JSON.parse(JSON.stringify(showContent));
      tempShowContent[index] = false;
      setShowContent(tempShowContent);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // set the url of Google map API
    setUrl(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        address +
        "&key=" +
        API_KEY
    );

    // set the range data
    setDistanceRange(
      e.target.parentElement.querySelector("div.range select#distanceRange")
        .value
    );
    setTimeRange(
      e.target.parentElement.querySelector("div.range select#timeRange").value
    );
  };

  // when the url changes, fetch the latitude and longitude of the address
  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setLat(
          response.data["results"][0]["geometry"]["viewport"]["northeast"][
            "lat"
          ]
        );
        setLng(
          response.data["results"][0]["geometry"]["viewport"]["northeast"][
            "lng"
          ]
        );
      })
      .catch((err) => {
        setError(err);
        console.log(err);
      });
  }, [url]);

  // when the address or ranges changes, call API
  useEffect(() => {
    // get "environment" data and set
    fetchAQI(lat, lng, setAQIRowData);
    fetchUV(lat, lng, setUVRowData);
    // fetchWQI(lat, lng, setWQIRowData);

    // get "eco" data and set
    fetchGreen(
      lat,
      lng,
      distanceRange,
      setGreenResLoc,
      setGreenResRowData,
      setGreenStoreLoc,
      setGreenStoreRowData
    );
    fetchReward(lat, lng, distanceRange, setRewardResLoc, setRewardResRowData);
    fetchGarbage(lat, lng, distanceRange, setGarbageRowData, setGarbageLoc);
    fetchClothes(lat, lng, distanceRange, setClothesRowData, setClothesLoc);
    fetchDisposal(lat, lng, distanceRange, setDisposalRowData, setDisposalLoc);

    // get "safety" data and set
    fetchTheft(
      lat,
      lng,
      distanceRange,
      timeRange,
      setTheftRowData,
      setTheftLoc
    );
    fetchAccident(
      lat,
      lng,
      distanceRange,
      timeRange,
      setAccidentRowData,
      setAccidentLoc
    );
  }, [lat, lng, timeRange, distanceRange]);

  return (
    <form className="search" onSubmit={submitHandler}>
      <div className="addressTags">
        <label htmlFor="address">??????</label>
        <input
          type="text"
          id="address"
          name="inputAddress"
          value={address}
          onChange={inputHandler}
        />
      </div>
      <div className="conditionTags">
        <label htmlFor="condition">????????????</label>
        <button className="condition" onClick={onclickEnvironment}>
          ????????????
        </button>
        <button className="condition" onClick={onclickEco}>
          ??????
        </button>
        <button className="condition" onClick={onclickSafety}>
          ??????
        </button>
      </div>
      <div className="range">
        <label htmlFor="distanceRange">????????????</label>
        <select name="distanceRange" id="distanceRange">
          <option value="1000">????????????</option>
          <option value="250">?????????????????????</option>
          <option value="500">???????????????</option>
          <option value="2000">????????????</option>
        </select>
        <label htmlFor="timeRange">????????????</label>
        <select name="timeRange" id="timeRange">
          <option value="6">?????????</option>
          <option value="1">????????????</option>
          <option value="3">????????????</option>
          <option value="12">?????????</option>
        </select>
      </div>
      <button className="submit" type="submit">
        ??????
      </button>
    </form>
  );
};

export default Form;
