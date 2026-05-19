/**
 * Inngest background jobs (e.g. monthly featured-design email campaign).
 */
import { Inngest } from "inngest";
import { prisma } from "../config/prisma";
import sendEmail from "../config/nodemailer";

export const inngest = new Inngest({ id: "keplans" });

/** Cron: 10:00 UTC on the 1st of each month — email featured designs to all users */
const sendMonthlyOffers = inngest.createFunction(
  {
    id: "send-monthly-offers",
    name: "Monthly Payday Offers",
    triggers: [{ cron: "0 10 1 * *" }],
  },
  async ({ step }) => {
    const { deals, users } = await step.run(
      "fetch-deals-and-users",
      async () => {
        const designs = await prisma.design.findMany({
          where: { featured: true },
          orderBy: { createdAt: "desc" },
          take: 6,
        });

        const allUsers = await prisma.user.findMany({
          select: { name: true, email: true },
        });

        return { deals: designs, users: allUsers };
      }
    );

    if (users.length === 0 || deals.length === 0) {
      return { skipped: true, reason: "No users or deals" };
    }

    let sentCount = 0;
    const batchSize = 10;
    const clientUrl =
      process.env.CLIENT_URL || "http://localhost:5173";

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);

      await step.run(`send-offers-batch-${i}`, async () => {
        for (const u of batch) {
          const dealsRows = deals.reduce(
            (rows: (typeof deals)[], _: (typeof deals)[0], idx: number) => {
              if (idx % 3 === 0) rows.push(deals.slice(idx, idx + 3));
              return rows;
            },
            []
          );

          const tableHtml = dealsRows
            .map(
              (row) => `
              <tr>
                ${row
                  .map(
                    (p) => `
                    <td style="width:33%;padding:8px;vertical-align:top;">
                      <div style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;text-align:center;">
                        ${
                          p.images?.length
                            ? `<img src="${p.images[0]}" alt="${p.title}" style="width:100%;height:100px;object-fit:cover;" />`
                            : ""
                        }
                        <div style="padding:10px;">
                          <p style="margin:0;font-size:13px;font-weight:600;">${p.title}</p>
                          <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#16a34a;">
                            KES ${p.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </td>`
                  )
                  .join("")}
              </tr>`
            )
            .join("");

          await sendEmail({
            to: u.email,
            subject: "Featured House Plans Just For You!",
            body: `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:auto;">
              <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:24px 28px;">
                <h2 style="color:#fff;margin:0;">Featured Architecture Plans</h2>
              </div>
              <div style="padding:28px;">
                <p>Hi <strong>${u.name}</strong>, check out this month's top designs!</p>
                <table width="100%">${tableHtml}</table>
                <p style="text-align:center;margin-top:24px;">
                  <a href="${clientUrl}/products" style="background:#2563eb;color:#fff;padding:12px 32px;border-radius:12px;text-decoration:none;">
                    Shop All Designs →
                  </a>
                </p>
              </div>
            </div>`,
          });
        }
      });

      sentCount += batch.length;
    }

    return { sent: sentCount };
  }
);

export const functions = [sendMonthlyOffers];
