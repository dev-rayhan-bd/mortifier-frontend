"use client";
import { useGetallPersonalTrainerQuery } from "@/redux/features/admin/allPersonalTrainer/allPersonalTrainerApi";
import { useUpdateUserMutation } from "@/redux/features/admin/userManagement/userManagementApi";
import {
  Avatar,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Spin,
  Table,
} from "antd";
import Image from "next/image";
import { useState } from "react";
import defaultImage from "../../../assets/profile/default-image.png";

const PersonalTrainersTable = ({ searchQuery }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: getallPersonalTrainerData, isLoading } =
    useGetallPersonalTrainerQuery({
      page: currentPage,
      searchTerm: searchQuery,
    });
  // console.log(getallPersonalTrainerData?.data);
  const [updateUser] = useUpdateUserMutation();

  const confirm = (id) => {
    updateUser(id)
      .unwrap()
      .then(() => {
        message.success("Status Changed Successfully");
      })
      .catch((error) => {
        message.error(error?.data?.message);
      });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "userData",
      key: "image",
      render: (_, record) =>
        record?.profileImageUrl ? (
          <Avatar size={40} src={`${record?.profileImageUrl}`} />
        ) : (
          <Avatar size={40} src="https://avatar.iran.liara.run/public/43" />
        ),
    },
    {
      title: "Name",
      dataIndex: "firstName",
      key: "name",
      render: (_, record) => (
        <p>{`${record?.firstName} ${record?.lastName}`}</p>
      ),
    },
    {
      title: "Email",
      dataIndex: "userData",
      key: "email",
      render: (_, record) => record?.userData?.email || "N/A",
    },
    {
      title: "Contact No",
      dataIndex: "contactNo",
      render: (_, record) => record?.contactNo,
    },
    {
      title: "Qualification",
      dataIndex: "qualification",
      key: "qualification",
      render: (qualification) => qualification?.join(", ") || "N/A",
    },
    {
      title: "User Status",
      dataIndex: "userData",
      key: "status",
      render: (_, record) => (
        <button
          className={`cursor-default px-2 py-1 rounded-md ${
            record?.userData?.status === "in-progress"
              ? "bg-green-500 text-white"
              : "bg-yellow-500 text-black"
          }`}
        >
          {record?.userData?.status || "N/A"}
        </button>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title={`${
            record?.userData?.status === "blocked" ? "Unblock" : "Ban"
          }  This User`}
          description={`Are you sure you want to ${
            record?.userData?.status === "blocked" ? "unblock" : "ban"
          } this user? `}
          onConfirm={() => confirm(record?.userData?._id)}
          okText="Yes"
          cancelText="No"
        >
          {record?.userData?.status === "blocked" ? (
            <button className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">
              unblock
            </button>
          ) : (
            <button className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">
              Ban
            </button>
          )}
        </Popconfirm>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => <UserDetailsModal userData={record} />,
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className=" h-[40vh] flex justify-center items-center">
        <Spin size="large"></Spin>
      </div>
    );
  }

  return (
    <div>
      <Table
        pagination={false}
        columns={columns}
        dataSource={getallPersonalTrainerData?.data?.data || []}
      />
      <div className="mt-6">
        {getallPersonalTrainerData?.data?.data?.length !== 0 && (
          <Pagination
            current={getallPersonalTrainerData?.data?.meta?.page}
            pageSize={getallPersonalTrainerData?.data?.meta?.limit}
            total={getallPersonalTrainerData?.data?.meta?.total}
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default PersonalTrainersTable;

// view modal user details
const UserDetailsModal = ({ userData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("userData 181 ", userData);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // date of birth
  const dateOfBirth = new Date(userData?.dob);
  const day = dateOfBirth.getDate();
  const month = dateOfBirth.getMonth() + 1;
  const year = dateOfBirth.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return (
    <>
      <button
        className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
        onClick={showModal}
      >
        View
      </button>
      <Modal
        title="User Details"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <div>
          <div className="flex gap-4">
            {/* left side (image/profile) */}
            <div className="flex justify-center items-center w-full">
              {userData?.profileImageUrl ? (
                <Image
                  width={320}
                  height={350}
                  src={userData?.profileImageUrl}
                  alt="Profile"
                  className="object-cover"
                />
              ) : (
                <Image
                  width={0}
                  height={0}
                  src={defaultImage}
                  alt="Profile"
                  className="w-[80%] h-auto object-cover"
                />
              )}
            </div>
            {/* right side (user details) */}
            <div className="w-full">
              <h1 className="font-semibold text-lg mb-3">User Details</h1>
              <div className="flex flex-col  divide-y">
                <DetailsItem
                  name="Name"
                  value={`${userData?.title || ""} ${userData?.firstName} ${
                    userData?.lastName
                  }`}
                />
                <DetailsItem
                  name="Email"
                  value={userData?.userData?.email || "N/A"}
                />
                <DetailsItem
                  name="Role"
                  value={userData?.userData?.role || "N/A"}
                />
                <DetailsItem
                  name="Contact No"
                  value={userData?.contactNo || "N/A"}
                />
                <DetailsItem
                  name="Date of Birth"
                  value={formattedDate || "N/A"}
                />
                <DetailsItem
                  name="Address"
                  value={userData?.country || "N/A"}
                />
                <DetailsItem
                  name="User Status"
                  value={userData?.userData?.status || "N/A"}
                />
              </div>
            </div>
          </div>

          {/* description */}
          <div className="mt-4">
            <h2 className="font-semibold text-lg">About:</h2>{" "}
            <p> {userData?.about || "N/A"}</p>
          </div>

          {/* specialism */}
          <div className="my-4">
            <h2 className="font-semibold text-lg">Specialism:</h2>{" "}
            <ul className="pl-2 flex flex-wrap gap-x-4 gap-y-2">
              {userData?.specialism?.map((item, index) => (
                <li className="" key={index}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
};

function DetailsItem({ name, value }) {
  return (
    <div className="flex justify-between py-2">
      <h4 className="font-semibold">{name}</h4>
      <p className="text-right">{value}</p>
    </div>
  );
}
