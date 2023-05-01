import React, { useState, useContext, useEffect } from "react";
import {
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import AuthContext from "./authContext";
import PasswordValidationBox from "./PasswordValidationBox";

interface UpdatePasswordModalProps {
  onUpdatePassword: (
    password: string,
    newPassword: string,
    repeatPassword: string
  ) => Promise<Boolean>;
  trigger: React.ReactNode;
}

const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({
  onUpdatePassword,
  trigger,
}) => {
  const { user, updateUser } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [lengthValid, setLengthValid] = useState(false);
  const [specialCharValid, setSpecialCharValid] = useState(false);
  const [capitalLetterValid, setCapitalLetterValid] = useState(false);
  const [repeatPasswordValid, setRepeatPasswordValid] = useState(false);
  const allCriteriaMet =
    lengthValid &&
    specialCharValid &&
    capitalLetterValid &&
    repeatPasswordValid;

  useEffect(() => {
    setLengthValid(newPassword.length <= 30 && newPassword.length >= 8);
    setSpecialCharValid(/[!@#$%^&*]/.test(newPassword));
    setCapitalLetterValid(/[A-Z]/.test(newPassword));
    setRepeatPasswordValid(
      newPassword === repeatPassword && newPassword !== ""
    );
  }, [newPassword, repeatPassword]);

  const handleSubmit = async () => {
    const updateSuccessful = await onUpdatePassword(
      password,
      newPassword,
      repeatPassword
    );

    if (updateSuccessful && user) {
      onClose();
    }
  };

  return (
    <>
      {React.cloneElement(trigger as React.ReactElement, { onClick: onOpen })}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody marginBottom="7">
            <FormControl id="current-password">
              <FormLabel>Current Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl id="new-password" mt={4}>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormControl>
            <FormControl id="repeat-new-password" mt={4}>
              <FormLabel>Repeat New Password</FormLabel>
              <Input
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <PasswordValidationBox
            lengthValid={lengthValid}
            specialCharValid={specialCharValid}
            capitalLetterValid={capitalLetterValid}
            repeatPasswordValid={repeatPasswordValid}
            allCriteriaMet={allCriteriaMet}
          />
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Update Password
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdatePasswordModal;
