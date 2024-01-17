"use server";

import { userSession } from "@/hooks/userSession";
import { prisma } from "@/lib/db/prisma";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function EnrollCourse({ courseId }: { courseId: string }) {
  try {
    const { id, email } = await userSession();

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: id,
          courseId: courseId,
        },
      },
    });

    if (purchase) {
      throw new Error("Already purchased");
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    let stripeCustomer = await prisma.stripeCustomer.findUnique({
      where: {
        userId: id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: email!,
      });

      stripeCustomer = await prisma.stripeCustomer.create({
        data: {
          userId: id,
          stripeCustomerId: customer.id,
        },
      });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
      metadata: {
        courseId: course.id,
        userId: id,
      },
    });
    return {
      url: stripeSession.url,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
}
