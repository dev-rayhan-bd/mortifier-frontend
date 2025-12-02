"use client";
import {
  useDeleteUserMutation,
  useGetallUserManagementQuery,
  useUpdateUserMutation,
} from "@/redux/features/admin/userManagement/userManagementApi";
import {
  Avatar,
  Button,
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
import { MdDelete } from "react-icons/md";

const AllUsers = ({ searchQuery }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: getallUserManagementData, isLoading,refetch } =
    useGetallUserManagementQuery({
      page: currentPage,
      searchTerm: searchQuery,
    });
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

   const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
console.log("user to delete------>",userToDelete);
  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    console.log("inside confirm delete");
    if (userToDelete) {
      const id = userToDelete
      deleteUser(id)
        .unwrap()
        .then(() => {
          message.success("User Deleted Successfully");
          setIsDeleteModalVisible(false);
        refetch()
        })
        .catch((error) => {
          message.error(error?.data?.message || "Failed to delete user");
                setIsDeleteModalVisible(false);
        });
    }
  };

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
          <Avatar size={40} src={defaultImage} />
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
      render: (_, record) => record?.userData?.email,
    },
    {
      title: "Contact No",
      dataIndex: "contactNo",
      render: (_, record) => record?.contactNo,
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
      title: "View",
      key: "action",
      render: (_, record) => (
        <>
          <UserDetailsModal userData={record} />
        </>
      ),
    },
    {
      title: "Delete",
      key: "action",
      render: (_, record) => (
        <>
          <MdDelete  size={24} className="text-red-500"     onClick={() => handleDeleteUser(record?._id)}/>
        </>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className=" h-[40vh] flex justify-center items-center">
        <Spin size="large"></Spin>
      </div>
    );
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Table
        pagination={false}
        columns={columns}
        dataSource={getallUserManagementData?.data?.data || []}
      />
      <div className="mt-6">
        {getallUserManagementData?.data?.data?.length !== 0 && (
          <Pagination
            current={getallUserManagementData?.data?.meta?.page}
            pageSize={getallUserManagementData?.data?.meta?.limit}
            total={getallUserManagementData?.data?.meta?.total}
            onChange={handlePageChange}
          />
        )}
      </div>
<Modal
  title="Confirm Delete"
  visible={isDeleteModalVisible}
  onCancel={() => setIsDeleteModalVisible(false)} // Close the modal on Cancel
  footer={[
    <Button
      key="cancel"
      onClick={() => setIsDeleteModalVisible(false)} // Close the modal on Cancel
    >
      Cancel
    </Button>,
    <Button
      key="confirm"
      type="primary" // "primary" type for the "Yes" button
      danger // "danger" type for a delete confirmation button
      onClick={()=>confirmDelete()}
    >
      Yes
    </Button>,
  ]}
>
  <p>Are you sure you want to delete this user?</p>
</Modal>

    </div>
  );
};

export default AllUsers;

// view modal user details
const UserDetailsModal = ({ userData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <div className="flex flex-col divide-y">
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
                name="Contact No"
                value={userData?.contactNo || "N/A"}
              />
              <DetailsItem
                name="Date of Birth"
                value={formattedDate || "N/A"}
              />
              <DetailsItem name="Address" value={userData?.address || "N/A"} />
              <DetailsItem
                name="User Status"
                value={userData?.userData?.status || "N/A"}
              />
            </div>
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
