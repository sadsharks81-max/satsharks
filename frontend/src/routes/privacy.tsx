import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, type LegalSection } from "../components/legal/LegalPage";

const EFFECTIVE_DATE = "November 14, 2026";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | SAT Sharks" },
      {
        name: "description",
        content:
          "Learn how SAT Sharks collects, uses, protects, and shares personal information across its SAT preparation, counseling, and live-class services.",
      },
      { property: "og:title", content: "Privacy Policy | SAT Sharks" },
      {
        property: "og:description",
        content: "How SAT Sharks handles account, learning, payment, and live-class information.",
      },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  const sections: LegalSection[] = [
    {
      id: "scope",
      title: "Who we are and what this policy covers",
      content: (
        <>
          <p>
            SAT Sharks ("SAT Sharks," "we," "us," or "our") provides SAT preparation, educational
            dashboards, live classes, admissions counseling, essay review, and related services.
            This Privacy Policy explains how we handle personal information when you use our
            website, student, teacher, or administrator portals, live classroom, recorded lectures,
            or communicate with us.
          </p>
          <p>
            SAT Sharks is responsible for deciding how personal information collected through the
            platform is used. If a specific service displays an additional privacy notice, that
            notice also applies to that service.
          </p>
        </>
      ),
    },
    {
      id: "information-we-collect",
      title: "Information we collect",
      content: (
        <>
          <p>
            We collect information you provide, information created through your use of SAT Sharks,
            and limited technical information needed to operate the platform.
          </p>
          <h3>Account and profile information</h3>
          <ul>
            <li>
              Name, email address, country, account role, region, subscription and access status.
            </li>
            <li>
              Account preferences such as target SAT score, daily goal, streak, and learning
              progress.
            </li>
            <li>
              Authentication and security records. Passwords are stored in hashed form, not as
              readable text.
            </li>
          </ul>
          <h3>Learning and counseling information</h3>
          <ul>
            <li>
              Practice answers, test attempts, scores, timing, progress, analytics, vocabulary
              activity, and leaderboard points.
            </li>
            <li>
              Essays, uploaded files, target universities, counseling requests, feedback, and
              university-matcher selections.
            </li>
            <li>
              Contact inquiries, booking details, support messages, and other information you choose
              to send us.
            </li>
          </ul>
          <h3>Payments and transactions</h3>
          <ul>
            <li>
              Selected plan, amount, transaction status, payment method category, and related
              account details.
            </li>
            <li>
              Payment receipt screenshots submitted for manual verification. These may contain
              information shown by your bank or wallet provider, so you should obscure unrelated
              balances or transactions before uploading.
            </li>
            <li>
              Card details are collected and processed by the payment provider, such as Stripe, and
              are not stored by SAT Sharks on its servers.
            </li>
          </ul>
          <h3>Live classes and recordings</h3>
          <ul>
            <li>
              Class attendance, join and leave times, chat messages, poll responses, and whiteboard
              activity.
            </li>
            <li>
              Audio, camera video, screen shares, and other content visible or audible in a live
              class when recording is enabled. A recording may therefore include a participant's
              name, voice, image, or shared screen.
            </li>
          </ul>
          <h3>Device and usage information</h3>
          <p>
            We may process IP address, browser and device type, request and error logs, timestamps,
            pages used, and security events. We also use browser storage to keep you signed in and
            maintain essential application state. We do not currently use this information to sell
            targeted advertising.
          </p>
        </>
      ),
    },
    {
      id: "how-we-use-information",
      title: "How we use information",
      content: (
        <>
          <p>We use personal information to:</p>
          <ul>
            <li>
              Create and secure accounts, authenticate users, and provide the appropriate student,
              teacher, or administrator access.
            </li>
            <li>
              Deliver tests, practice tools, live classes, recordings, counseling, essay feedback,
              progress tracking, and personalized learning features.
            </li>
            <li>
              Process purchases, verify payment proofs, maintain transaction records, and provide
              customer support.
            </li>
            <li>
              Send service messages such as password resets, class notifications, access updates,
              and responses to inquiries.
            </li>
            <li>
              Monitor reliability, prevent fraud and misuse, investigate security incidents, and
              enforce our Terms of Service.
            </li>
            <li>
              Understand and improve the platform using aggregated or de-identified information
              where practical.
            </li>
            <li>Comply with applicable law and respond to valid legal requests.</li>
          </ul>
          <p>
            Depending on the context and applicable law, we process information to perform our
            contract with you, with your consent, to meet legal obligations, or for legitimate
            interests such as platform security and service improvement. You may withdraw consent
            where consent is the basis for processing, although this does not affect earlier lawful
            processing.
          </p>
        </>
      ),
    },
    {
      id: "classroom-privacy",
      title: "Live classes, polls, and recordings",
      content: (
        <>
          <p>
            Teachers or administrators may record a live class for enrolled students to review. When
            recording is active, the classroom should display an in-product indication. If you do
            not want your camera, voice, or screen included, keep your camera and microphone off, do
            not share your screen, and contact the teacher before participating. Attendance and
            text-based classroom activity may still be recorded as part of operating the class.
          </p>
          <p>
            Student poll selections are available to authorized teachers and administrators for
            classroom management. Other students do not see poll totals or the leading option unless
            a teacher or administrator deliberately reveals the results. Revealed results are shown
            as totals rather than a public list of how each student voted.
          </p>
          <p>
            Recorded lectures are intended only for users who have been given access through SAT
            Sharks. Downloading, copying, or redistributing a recording without permission is
            prohibited.
          </p>
        </>
      ),
    },
    {
      id: "sharing",
      title: "How we share information",
      content: (
        <>
          <p>
            <strong>We do not sell personal information.</strong> We share information only as
            needed for the purposes described in this policy, including with:
          </p>
          <ul>
            <li>
              <strong>Authorized SAT Sharks personnel.</strong> Teachers see information needed to
              teach assigned students; administrators may access information needed to operate,
              support, secure, and manage the service.
            </li>
            <li>
              <strong>Service providers.</strong> Hosting and database providers, Cloudinary or
              managed file storage, email providers, LiveKit for live-class delivery and recording,
              Google Drive for recording storage when enabled, and similar vendors that process
              information for us.
            </li>
            <li>
              <strong>Payment and booking providers.</strong> Stripe and relevant banks or wallet
              services process payments; Calendly may process information when you open its
              scheduling widget. Their own privacy notices also apply.
            </li>
            <li>
              <strong>Legal and safety recipients.</strong> Courts, regulators, law enforcement, or
              other parties where disclosure is required by law or reasonably necessary to protect
              users, the public, or SAT Sharks.
            </li>
            <li>
              <strong>Business transfers.</strong> A successor may receive relevant information as
              part of a merger, financing, reorganization, or sale, subject to appropriate
              confidentiality and applicable law.
            </li>
          </ul>
          <p>
            We require service providers to handle information only for authorized purposes and with
            appropriate safeguards.
          </p>
        </>
      ),
    },
    {
      id: "google-data",
      title: "Google Drive and Google user data",
      content: (
        <>
          <p>
            If the Google Drive recording integration is enabled, the Drive owner authorizes SAT
            Sharks through Google OAuth. SAT Sharks requests per-file access and uses it to create
            and manage live-class recordings in the configured folder and make those recordings
            available through the SAT Sharks platform. The integration is not designed to read
            unrelated files in the owner&apos;s Drive.
          </p>
          <p>
            Information received from Google APIs is not sold, used for advertising, or transferred
            to data brokers. Human access is limited to what is necessary to provide support,
            investigate security or technical issues, comply with law, or act with the account
            owner's permission. Our use and transfer of information received from Google APIs
            follows the Google API Services User Data Policy, including its Limited Use
            requirements.
          </p>
          <p>
            The Drive owner may revoke future access from SAT Sharks Admin Settings or the connected
            Google Account. Revocation does not automatically delete recording files or platform
            records already created; contact us to request deletion where applicable.
          </p>
        </>
      ),
    },
    {
      id: "retention",
      title: "How long we keep information",
      content: (
        <>
          <p>
            We retain information only for as long as reasonably necessary to provide the service,
            maintain educational and transaction records, resolve disputes, enforce agreements, meet
            legal obligations, and protect the platform. Retention depends on the type of data and
            why it was collected.
          </p>
          <ul>
            <li>
              Account and learning records are generally kept while the account is active and for a
              reasonable period afterward.
            </li>
            <li>
              Pending payment receipt images are restricted to authorized reviewers and removed from
              the payment record after approval or rejection. Transaction metadata may be retained
              for accounting, fraud prevention, and legal requirements.
            </li>
            <li>
              Live-class recordings remain available until they are deleted by an authorized
              administrator, the storage owner, or under the applicable program's retention process.
            </li>
            <li>
              Security logs and backups may remain for a limited period after operational data is
              deleted.
            </li>
          </ul>
          <p>
            We may retain de-identified or aggregated information that no longer identifies an
            individual.
          </p>
        </>
      ),
    },
    {
      id: "security-transfers",
      title: "Security and international processing",
      content: (
        <>
          <p>
            We use reasonable administrative, technical, and organizational measures designed to
            protect personal information, including access controls, hashed passwords, restricted
            administrative permissions, and encrypted network connections where supported. No online
            service can guarantee absolute security, so please use a unique password and tell us
            promptly if you suspect unauthorized access.
          </p>
          <p>
            SAT Sharks and its providers may process information in Pakistan and other countries.
            Where information crosses borders, we use contractual, technical, or other safeguards
            appropriate to the information and applicable law.
          </p>
        </>
      ),
    },
    {
      id: "rights",
      title: "Your choices and privacy rights",
      content: (
        <>
          <p>Depending on where you live and subject to applicable law, you may ask us to:</p>
          <ul>
            <li>Confirm whether we process your personal information and provide access to it.</li>
            <li>Correct inaccurate or incomplete information.</li>
            <li>Delete information or restrict or object to certain processing.</li>
            <li>Provide a portable copy of information you supplied.</li>
            <li>Withdraw consent or complain to an appropriate privacy authority.</li>
          </ul>
          <p>
            You can update some information through your account. For other requests, email
            <a href="mailto:satsharks@gmail.com"> satsharks@gmail.com</a>. We may need to verify
            your identity and may retain information where required by law or needed for legitimate
            security, recordkeeping, or dispute-resolution purposes.
          </p>
        </>
      ),
    },
    {
      id: "children",
      title: "Children and student accounts",
      content: (
        <>
          <p>
            SAT Sharks is an educational service and some students may be minors. The service is not
            directed to children under 13, and we do not knowingly create accounts for children
            under 13 without verifiable authorization from a parent, guardian, school, or other
            party permitted by law.
          </p>
          <p>
            If you are below the age at which you can consent to data processing or enter a contract
            in your location, a parent or legal guardian must review this policy and authorize your
            use. A parent or guardian who believes a child provided information without appropriate
            permission should contact us so we can investigate and take appropriate action.
          </p>
        </>
      ),
    },
    {
      id: "changes-contact",
      title: "Changes and contact us",
      content: (
        <>
          <p>
            We may update this Privacy Policy when our services, vendors, or legal obligations
            change. We will post the revised policy here, update the effective date, and provide
            additional notice where a material change requires it.
          </p>
          <p>
            For privacy questions or requests, contact SAT Sharks at
            <a href="mailto:satsharks@gmail.com"> satsharks@gmail.com</a> or call
            <a href="tel:+923164514334"> +92 316 451 4334</a>.
          </p>
        </>
      ),
    },
  ];

  return (
    <LegalPage
      eyebrow="Your privacy at SAT Sharks"
      title="Privacy Policy"
      summary="This policy explains what information we collect, why we use it, who may receive it, and the choices available to students, parents, teachers, and other users."
      effectiveDate={EFFECTIVE_DATE}
      highlights={[
        {
          icon: "visibility_off",
          title: "No sale of personal data",
          description:
            "We do not sell personal information or use Google user data for advertising.",
        },
        {
          icon: "school",
          title: "Built around learning",
          description:
            "Account and activity data is used to provide classes, tests, feedback, and progress tools.",
        },
        {
          icon: "manage_accounts",
          title: "You have choices",
          description:
            "You can request access, correction, deletion, or other rights available under applicable law.",
        },
      ]}
      sections={sections}
    />
  );
}
