import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface EmailProps {
  firstName?: string;
  link?: string;
}

export const EmailChangeApproval = ({ firstName, link }: EmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#f6f9fc] py-2.5">
          <Preview>Approve new email address</Preview>
          <Container className="border border-solid border-[#f0f0f0] bg-white p-12">
            <Img
              src="https://res.cloudinary.com/dwwbtbkyy/image/upload/v1767454931/Logo_olnr7g.png"
              width={100}
              height={100}
              alt="MotoGP DB Logo"
            />
            <Section>
              <Text className="font-poppins text-base leading-6 font-light text-[#404040]">
                Hi {firstName},
              </Text>
              <Text className="font-poppins text-base leading-6 font-light text-[#404040]">
                Someone recently requested an email change for your MotoGP DB
                account. If this was you, you can approve the change here:
              </Text>
              <Button
                className="font-poppins block w-54 rounded bg-orange-400 px-2 py-4 text-center text-[15px] font-semibold text-white no-underline"
                href={link}
              >
                Approve email change
              </Button>
              <Text className="font-poppins text-base leading-6 font-light text-[#404040]">
                If you don&apos;t want to change your email or didn&apos;t
                request this, just ignore and delete this message.
              </Text>
              <Text className="font-poppins text-base leading-6 font-light text-[#404040]">
                To keep your account secure, please don&apos;t forward this
                email to anyone.
              </Text>
              <Text className="font-poppins text-base leading-6 font-light text-[#404040]">
                <span className="font-semibold">Note: </span>Following approval
                of the change, the new email address will{' '}
                <span className="font-semibold">NOT</span> be valid until you
                verify it.{' '}
                <span className="font-semibold">
                  Please check your new email inbox for the verification email.
                </span>
              </Text>
              <Text className="font-poppins text-base leading-6 font-light text-[#404040]">
                Enjoy racing!
              </Text>
              <Text className="font-poppins text-base leading-6 font-semibold text-[#404040]">
                The MotoGP DB Team
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export const PasswordReset = ({ firstName, link }: EmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#f6f9fc] py-2.5">
          <Preview>Reset your password</Preview>
          <Container className="border border-solid border-[#f0f0f0] bg-white p-12">
            <Img
              src="https://res.cloudinary.com/dwwbtbkyy/image/upload/v1768667998/Logo_small.png"
              width={100}
              height={100}
              alt="MotoGP DB Logo"
            />
            <Section>
              <Text className="font-poppins text-base leading-6 font-light text-[#404040]">
                Hi {firstName},
              </Text>
              <Text className="font-poppins text-base leading-6 font-light text-[#404040]">
                Someone recently requested a password reset for your MotoGP DB
                account. If this was you, you can reset your password here:
              </Text>
              <Button
                className="font-poppins block w-54 rounded bg-orange-400 px-2 py-4 text-center text-[15px] font-semibold text-white no-underline"
                href={link}
              >
                Reset password
              </Button>
              <Text className="font-poppins text-base leading-6 font-light text-[#404040]">
                If you don&apos;t want to reset your password or didn&apos;t
                request this, just ignore and delete this message.
              </Text>
              <Text className="font-poppins text-base leading-6 font-light text-[#404040]">
                To keep your account secure, please don&apos;t forward this
                email to anyone.
              </Text>
              <Text className="font-poppins text-base leading-6 font-light text-[#404040]">
                Enjoy racing!
              </Text>
              <Text className="font-poppins text-base leading-6 font-semibold text-[#404040]">
                The MotoGP DB Team
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export const EmailVerification = ({ firstName, link }: EmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#f6f9fc] py-2.5">
          <Preview>Verify your email</Preview>
          <Container className="border border-solid border-[#f0f0f0] bg-white p-12">
            <Img
              src="https://res.cloudinary.com/dwwbtbkyy/image/upload/v1767454931/Logo_olnr7g.png"
              width={100}
              height={100}
              alt="MotoGP DB Logo"
            />
            <Section>
              <Text className="font-poppins text-base leading-6 font-light text-[#404040]">
                Hi {firstName},
              </Text>
              <Text className="font-poppins text-base leading-6 font-light text-[#404040]">
                Please verify your email by clicking the button below:
              </Text>
              <Button
                className="font-poppins block w-54 rounded bg-orange-400 px-2 py-4 text-center text-[15px] font-semibold text-white no-underline"
                href={link}
              >
                Verify email address
              </Button>
              <Text className="font-poppins text-base leading-6 font-light text-[#404040]">
                If you didn&apos;t request this, just ignore and delete this
                message.
              </Text>
              <Text className="font-poppins text-base leading-6 font-light text-[#404040]">
                To keep your account secure, please don&apos;t forward this
                email to anyone.
              </Text>
              <Text className="font-poppins text-base leading-6 font-light text-[#404040]">
                Enjoy racing!
              </Text>
              <Text className="font-poppins text-base leading-6 font-semibold text-[#404040]">
                The MotoGP DB Team
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
