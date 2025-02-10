"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import { useSearchParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  getGuestDetails,
  saveStudentDetails,
} from "@/lib/student-dashboard/apiClient";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const GuestForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const subject = params.get("subject");
  const [formData, setFormData] = useState({
    studentName: "",
    grade: "",
    email: "",
    countryId: "",
    guestId: "",
    parentContact: "",
    parentName: "",
  });
  const [parentName, setParentName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({
    studentName: "",
    grade: "",
    email: "",
    phoneNumber: "",
    country: "",
  });
  const [countries, setCountries] = useState<Record<string, string>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabledEmail, setIsDisabledEmail] = useState(false);
  const [isDisabledPhone, setIsDisabledPhone] = useState(false);

  useEffect(() => {
    const userId = getCookie("userId");
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await getGuestDetails({
            guestId: userId,
          });
          if (response && Object.keys(response.guestInfo).length > 0) {
            setParentName(response.guestInfo?.guestName);

            if (response.guestInfo?.guestEmail) {
              setFormData((prevData) => ({
                ...prevData,
                email: response.guestInfo?.guestEmail,
              }));
              setIsDisabledEmail(true);
            }

            if (response.guestInfo?.contactNo) {
              setPhoneNumber(response.guestInfo?.contactNo);
              setIsDisabledPhone(true);
            }
          }
          if (response.countryDetails && response.countryDetails.length > 0) {
            setCountries(response.countryDetails);
          }
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.studentName.trim()) {
      setErrors((prevData) => ({
        ...prevData,
        studentName: "Student name is required",
      }));
      return false;
    }

    if (!formData.grade) {
      setErrors((prevData) => ({
        ...prevData,
        grade: "Grade is required",
      }));
      return false;
    }

    if (!formData.email.trim()) {
      setErrors((prevData) => ({
        ...prevData,
        email: "Email is required",
      }));
      return false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      setErrors((prevData) => ({
        ...prevData,
        email: "Invalid email address",
      }));
      return false;
    }

    if (!phoneNumber) {
      setErrors((prevData) => ({
        ...prevData,
        phoneNumber: "Phone number is required",
      }));
      return false;
    }

    if (!formData.countryId) {
      setErrors((prevData) => ({
        ...prevData,
        country: "Country is required",
      }));
      return false;
    }

    setErrors({
      studentName: "",
      grade: "",
      email: "",
      phoneNumber: "",
      country: "",
    });
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const data = formData;
    const userId = getCookie("userId");
    if (userId) {
      data.guestId = userId;
    }

    if (phoneNumber) {
      data.parentContact = phoneNumber;
    }

    if (parentName) {
      data.parentName = parentName;
    }

    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await saveStudentDetails(data);
        if (response && response.studentId) {
          setCookie("userName", formData.studentName);
          setCookie("userId", response.studentId);
          setCookie("grade", formData.grade);
          setCookie("userRole", "partial-parent");
        }
        if (response && response.parentId) {
          const mobileData = {
            type: "guestAuth",
            parentId: response.parentId,
          };
          window.ReactNativeWebView.postMessage(JSON.stringify(mobileData));
        }
        router.push(`/subject-dashboard?subject=${subject}`);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
  };

  return (
    <div className="flex flex-col px-4 justify-center align-middle my-10">
      {/* <CircularProgress color="inherit" size={25} /> */}
      <div className="flex justify-center font-bold text-base text-[#5B8989] leading-[19.36px]">
        Provide us few more details
      </div>
      <form onSubmit={handleSubmit}>
        <div className="">
          <div className="flex flex-col mt-4">
            <label className="font-bold text-sm my-2.5 text-[#5B8989] leading-[16.94px]">
              Child Name
            </label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              className="px-4 py-2 border focus:border-[#AFCFCF] focus:ring-[#AFCFCF]  w-full sm:text-sm border-[#5B8989] rounded-md focus:outline-none text-[#5B8989] placeholder-[#5B8989]"
              placeholder="Enter Child Name"
            />
            {errors.studentName && (
              <div className="mt-2 font-normal text-sm leading-5 text-right text-[#ff3333] ">
                {errors.studentName}
              </div>
            )}
          </div>

          <div className="flex flex-col mt-4">
            <label className="font-bold text-sm my-2.5 text-[#5B8989]  leading-[16.94px]">
              Grade
            </label>

            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="px-4 py-2 h-10 bg-[#ffffff] border focus:ring-[#AFCFCF]  w-full sm:text-sm border-[#5B8989] rounded-md focus:outline-none text-[#5B8989] placeholder-[#5B8989]"
            >
              <option value="">Select Grade</option>
              <option value="1">Grade 1</option>
              <option value="2">Grade 2</option>
              <option value="3">Grade 3</option>
              <option value="4">Grade 4</option>
              <option value="5">Grade 5</option>
              <option value="6">Grade 6</option>
              <option value="6">Grade 6</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
            {errors.grade && (
              <div className="mt-2 font-normal text-sm leading-5 text-right text-[#ff3333] ">
                {errors.grade}
              </div>
            )}
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold text-sm my-2.5 text-[#5B8989]  leading-[16.94px]">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-2 border focus:border-[#AFCFCF] focus:ring-[#AFCFCF]  w-full sm:text-sm border-[#5B8989] rounded-md focus:outline-none text-[#5B8989] placeholder-[#5B8989]"
              placeholder="Enter Email Address"
              disabled={isDisabledEmail}
            />
            {errors.email && (
              <div className="mt-2 font-normal text-sm leading-5 text-right text-[#ff3333] ">
                {errors.email}
              </div>
            )}
          </div>

          <div className="flex flex-col mt-4">
            <label className="font-bold text-sm my-2.5 text-[#5B8989]  leading-[16.94px]">
              Phone Number
            </label>

            <div>
              <PhoneInput
                country="in"
                value={phoneNumber}
                onChange={setPhoneNumber}
                // disabled={!!studentId}
                containerStyle={{
                  width: "100%",
                  // border: "1px solid #AFCFCF",
                  border: "none",
                  borderRadius: "12px",
                }}
                inputStyle={{
                  width: "100%",
                  height: "44px",
                  border: "1px solid #5B8989",
                  fontSize: "16px",
                  color: "#6C9D9D",
                }}
                disabled={isDisabledPhone}
              />
              {errors.phoneNumber && (
                <div className="mt-2 font-normal text-sm leading-5 text-right text-[#ff3333] ">
                  {errors.phoneNumber}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold text-sm my-2.5 text-[#5B8989]  leading-[16.94px]">
              Country
            </label>

            <select
              name="countryId"
              value={formData.countryId}
              onChange={handleChange}
              className="px-4 py-2 h-10 bg-[#ffffff] border focus:ring-[#AFCFCF]  w-full sm:text-sm border-[#5B8989] rounded-md focus:outline-none text-[#5B8989] placeholder-[#5B8989]"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.countryId} value={country.countryId}>
                  {country.countryName}
                </option>
              ))}
            </select>
            {errors.country && (
              <div className="mt-2 font-normal text-sm leading-5 text-right text-[#ff3333] ">
                {errors.country}
              </div>
            )}
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center space-x-4">
          <button
            type="submit"
            className="bg-[#E98451] text-[#FFFFFF] w-40 font-semibold flex justify-center items-center text-white px-4 py-3 rounded-lg focus:outline-none"
          >
            Launch
            <ArrowForwardIcon className="ml-3 text-[#FFFFFF]" />
          </button>
        </div>
      </form>
    </div>
  );
};

const GuestFormPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GuestForm />
    </Suspense>
  );
};

export default GuestFormPage;
