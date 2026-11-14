import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, type LegalSection } from "../components/legal/LegalPage";

const EFFECTIVE_DATE = "November 14, 2026";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | SAT Sharks" },
      {
        name: "description",
        content:
          "Review the terms that govern SAT Sharks accounts, SAT preparation, counseling, live classes, recordings, payments, and acceptable use.",
      },
      { property: "og:title", content: "Terms of Service | SAT Sharks" },
      {
        property: "og:description",
        content: "The rules and responsibilities that apply when using SAT Sharks services.",
      },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsOfService,
});

function TermsOfService() {
  const sections: LegalSection[] = [
    {
      id: "agreement",
      title: "Agreement to these terms",
      content: (
        <>
          <p>
            These Terms of Service ("Terms") are a binding agreement between you and SAT Sharks
            ("SAT Sharks," "we," "us," or "our"). They govern your access to our website, accounts,
            dashboards, SAT preparation, practice and testing tools, live and recorded classes,
            admissions counseling, essay review, and related services (collectively, the
            "Services").
          </p>
          <p>
            By creating an account, buying a plan, joining a class, or otherwise using the Services,
            you agree to these Terms and our Privacy Policy. If you do not agree, do not use the
            Services. Additional written terms displayed for a particular plan or service also
            apply; if they conflict with these Terms, the more specific terms control for that
            service.
          </p>
        </>
      ),
    },
    {
      id: "eligibility",
      title: "Eligibility and student accounts",
      content: (
        <>
          <p>
            You must be legally able to enter this agreement. If you are under the age of legal
            majority where you live, your parent or legal guardian must review and accept these
            Terms for you and is responsible for your use of the Services. The Services are not
            intended for children under 13 without appropriate authorization from a parent,
            guardian, school, or other party permitted by law.
          </p>
          <p>
            Parents or guardians who purchase or authorize Services for a student agree to these
            Terms on their own behalf and the student's behalf and should supervise the student's
            use.
          </p>
        </>
      ),
    },
    {
      id: "accounts",
      title: "Accounts and access",
      content: (
        <>
          <ul>
            <li>Provide accurate, current information and keep it updated.</li>
            <li>
              Keep your password and account access confidential. You are responsible for activity
              under your account unless caused by our failure to use reasonable security.
            </li>
            <li>
              Do not share, sell, transfer, or lend your account or paid access to another person.
            </li>
            <li>
              Notify us promptly at <a href="mailto:satsharks@gmail.com">satsharks@gmail.com</a> if
              you suspect unauthorized access.
            </li>
          </ul>
          <p>
            Access is limited to the role, plan, dates, class enrollment, and permissions assigned
            to the account. We may correct an incorrectly assigned role or plan and may require
            identity or payment verification before granting or restoring access.
          </p>
        </>
      ),
    },
    {
      id: "services",
      title: "Educational and counseling services",
      content: (
        <>
          <p>
            SAT Sharks provides educational instruction, practice materials, feedback, and
            admissions guidance. We may adjust instructors, schedules, lesson formats, question
            banks, features, or program content where reasonably necessary while seeking to preserve
            the core value of a purchased service.
          </p>
          <p>
            Your results depend on many factors outside our control, including prior preparation,
            attendance, effort, test-day performance, institution decisions, and changes to
            admissions requirements.{" "}
            <strong>
              We do not guarantee any SAT score, admission decision, scholarship, visa, financial
              aid, or other academic outcome.
            </strong>{" "}
            University-matcher results, estimates, and counseling recommendations are informational
            and should not replace your review of official institution requirements.
          </p>
          <p>
            SAT® is a registered trademark of the College Board. SAT Sharks is not endorsed by or
            affiliated with the College Board unless we expressly state otherwise.
          </p>
        </>
      ),
    },
    {
      id: "payments",
      title: "Plans, payments, cancellations, and refunds",
      content: (
        <>
          <p>
            Prices, currency, plan duration, included services, and payment timing are shown at
            checkout or in a written proposal. You authorize the selected payment provider to charge
            the displayed amount and are responsible for applicable bank, wallet,
            currency-conversion, or tax charges unless stated otherwise.
          </p>
          <ul>
            <li>
              Card payments may be processed by Stripe or another disclosed provider under that
              provider's terms.
            </li>
            <li>
              For bank, JazzCash, Raast, Easypaisa, or similar transfers, access may remain pending
              until an administrator verifies the payment.
            </li>
            <li>
              You must not submit an altered, misleading, duplicate, or unauthorized payment
              receipt.
            </li>
          </ul>
          <p>
            Cancellation and refund eligibility are governed by the written terms shown for the plan
            at purchase or otherwise agreed with SAT Sharks. If no plan-specific policy is
            displayed, contact us promptly so we can assess the request based on service delivery,
            scheduling, and applicable law. Nothing in these Terms limits a non-waivable consumer
            right.
          </p>
        </>
      ),
    },
    {
      id: "live-classes",
      title: "Live classes and recordings",
      content: (
        <>
          <p>
            Live classes may include audio, camera video, screen sharing, chat, polls, a
            collaborative whiteboard, attendance tracking, and recordings. When a class is being
            recorded, the classroom should display a recording indicator. By knowingly remaining in
            a recorded class, you acknowledge that content you make visible or audible may be
            captured, subject to the consent requirements that apply where you live.
          </p>
          <p>
            If you do not want your camera, voice, or screen captured, keep those features off and
            contact the teacher before participating. Teachers must avoid displaying confidential or
            unrelated personal information while sharing their screen. All participants must respect
            the privacy of others.
          </p>
          <p>
            Recordings are provided only for authorized educational use through SAT Sharks. You may
            not record a class independently or download, copy, edit, publish, share, sell, or
            otherwise distribute class recordings without our prior written permission and any
            required consent from participants.
          </p>
        </>
      ),
    },
    {
      id: "acceptable-use",
      title: "Acceptable use and academic integrity",
      content: (
        <>
          <p>You must not:</p>
          <ul>
            <li>
              Use the Services for unlawful, fraudulent, abusive, threatening, discriminatory, or
              harassing conduct.
            </li>
            <li>
              Cheat, impersonate another person, submit another person's work, or use confidential
              test content in violation of an exam provider's rules.
            </li>
            <li>
              Upload malware or harmful code, bypass access controls, probe for vulnerabilities,
              disrupt a class, or interfere with the platform or another user.
            </li>
            <li>
              Scrape, bulk-download, data mine, reverse engineer, or use automated systems to
              extract content or personal information except where law expressly permits it.
            </li>
            <li>
              Post or share content that infringes intellectual property, privacy, publicity, or
              other rights.
            </li>
            <li>
              Use class chat, polls, file uploads, or screen sharing for spam, advertising,
              unrelated content, or disclosure of sensitive information.
            </li>
          </ul>
          <p>
            Teachers and administrators must use their elevated access only for legitimate
            educational, support, safety, and administrative purposes.
          </p>
        </>
      ),
    },
    {
      id: "content-ip",
      title: "Content and intellectual property",
      content: (
        <>
          <h3>SAT Sharks content</h3>
          <p>
            The Services and their lessons, question sets, explanations, designs, software,
            graphics, recordings, branding, and other materials are owned by SAT Sharks or its
            licensors and are protected by intellectual property laws. Subject to these Terms and
            your plan, we grant you a limited, personal, non-exclusive, non-transferable, revocable
            license to use them for your own education. No ownership is transferred to you.
          </p>
          <h3>Your content</h3>
          <p>
            You retain ownership of essays, messages, files, screen shares, and other original
            content you submit. You grant SAT Sharks a limited, worldwide license to host, store,
            reproduce, transmit, display, and process that content only as reasonably necessary to
            provide, secure, support, and improve the Services, comply with law, and enforce these
            Terms. This license ends when the content is deleted, except for limited backups, legal
            retention, or content already shared at your direction.
          </p>
          <p>
            You represent that you have the rights and permissions needed to submit your content.
          </p>
        </>
      ),
    },
    {
      id: "privacy-third-parties",
      title: "Privacy and third-party services",
      content: (
        <>
          <p>
            Our <a href="/privacy">Privacy Policy</a> explains how we collect, use, and protect
            personal information. The Services may rely on or link to third-party services such as
            Stripe, LiveKit, Google Drive, Cloudinary, Calendly, banks, and wallet providers. Those
            services are governed by their own terms and privacy notices, and we are not responsible
            for their independent acts or content.
          </p>
          <p>
            A link or integration does not mean SAT Sharks endorses every third-party product. You
            are responsible for reviewing third-party terms that apply to your use.
          </p>
        </>
      ),
    },
    {
      id: "availability",
      title: "Availability, suspension, and termination",
      content: (
        <>
          <p>
            We work to keep the Services available but do not promise uninterrupted or error-free
            operation. Classes or features may be delayed or unavailable because of maintenance,
            internet or power failures, instructor emergencies, capacity limits, third-party
            outages, security events, or circumstances outside our reasonable control. Where
            practical, we may reschedule a materially affected live class or provide a reasonable
            alternative.
          </p>
          <p>
            We may restrict, suspend, or terminate access when reasonably necessary to protect users
            or the platform, investigate suspected misconduct or nonpayment, comply with law, or
            address a material breach of these Terms. Where appropriate, we will provide notice and
            an opportunity to resolve the issue. You may stop using the Services at any time;
            stopping use does not automatically create a refund right.
          </p>
          <p>
            Provisions that by their nature should survive termination—including payment
            obligations, intellectual property, disclaimers, liability limits, and dispute
            terms—will survive.
          </p>
        </>
      ),
    },
    {
      id: "disclaimers-liability",
      title: "Disclaimers and limits of liability",
      content: (
        <>
          <p>
            To the maximum extent permitted by law, the Services are provided "as is" and "as
            available." SAT Sharks disclaims implied warranties of merchantability, fitness for a
            particular purpose, non-infringement, and any warranty arising from course of dealing.
            This does not exclude a warranty that cannot legally be excluded.
          </p>
          <p>
            To the maximum extent permitted by law, SAT Sharks and its personnel will not be liable
            for indirect, incidental, special, consequential, exemplary, or punitive damages, or for
            loss of data, profits, opportunities, admissions, scholarships, or academic outcomes,
            arising from the Services. Our total liability for a claim will not exceed the amount
            you paid SAT Sharks for the specific Service giving rise to the claim during the six
            months before the event, or the minimum amount required by applicable law if greater.
          </p>
          <p>
            These limits do not apply where prohibited by law or to liability that cannot legally be
            limited, including liability for fraud or willful misconduct.
          </p>
        </>
      ),
    },
    {
      id: "law-disputes",
      title: "Governing law and disputes",
      content: (
        <>
          <p>
            These Terms are governed by the laws of Pakistan, without regard to conflict-of-laws
            principles. Before filing a formal claim, you and SAT Sharks agree to try in good faith
            to resolve the issue by written notice and discussion for at least 30 days. Send notices
            to
            <a href="mailto:satsharks@gmail.com"> satsharks@gmail.com</a> with a description of the
            issue and requested resolution.
          </p>
          <p>
            If the dispute is not resolved, it will be submitted to the courts of competent
            jurisdiction in Pakistan, unless applicable consumer law gives you the right to proceed
            elsewhere. Nothing here prevents either party from seeking urgent relief to protect
            safety, confidential information, or intellectual property.
          </p>
        </>
      ),
    },
    {
      id: "general",
      title: "Changes, general terms, and contact",
      content: (
        <>
          <p>
            We may update these Terms to reflect changes to the Services, law, security, or business
            practices. We will post the updated Terms, change the effective date, and provide
            additional notice where required. Continued use after revised Terms take effect means
            you accept them; if you do not agree, you must stop using the Services.
          </p>
          <p>
            If one provision is unenforceable, it will be adjusted only as much as necessary and the
            remaining provisions will continue in effect. A delay in enforcing a provision is not a
            waiver. You may not transfer this agreement without our consent; we may transfer it as
            part of a reorganization, financing, merger, or sale of the relevant business. These
            Terms and any applicable service-specific terms are the entire agreement about the
            Services.
          </p>
          <p>
            Questions about these Terms can be sent to
            <a href="mailto:satsharks@gmail.com"> satsharks@gmail.com</a> or
            <a href="tel:+923164514334"> +92 316 451 4334</a>.
          </p>
        </>
      ),
    },
  ];

  return (
    <LegalPage
      eyebrow="Rules for using SAT Sharks"
      title="Terms of Service"
      summary="These terms set clear expectations for accounts, educational services, payments, live classes, recordings, acceptable use, and ownership of content."
      effectiveDate={EFFECTIVE_DATE}
      highlights={[
        {
          icon: "fact_check",
          title: "Clear service expectations",
          description:
            "Plans provide educational services and guidance, but no score or admission outcome is guaranteed.",
        },
        {
          icon: "lock_person",
          title: "Personal account access",
          description:
            "Keep your login private and use course materials and recordings only as authorized.",
        },
        {
          icon: "handshake",
          title: "Respectful participation",
          description:
            "Protect classmates' privacy and follow academic-integrity and classroom conduct rules.",
        },
      ]}
      sections={sections}
    />
  );
}
