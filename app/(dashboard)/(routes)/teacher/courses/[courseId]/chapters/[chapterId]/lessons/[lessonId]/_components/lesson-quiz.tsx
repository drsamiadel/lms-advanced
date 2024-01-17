"use client";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Dot, MessageCircleQuestionIcon, Pencil, Plus, Trash, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Lesson, Question, Quiz } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface LessonQuizProps {
  initialData: Lesson & {
    quizzes:
      | (Quiz & {
          questions: Question[];
        })
      | null;
  };
  courseId: string;
  chapterId: string;
  lessonId: string;
}

interface LessonQuizProps {}

export default function LessonQuiz({
  initialData: { quizzes, ...initialData },
  courseId,
  chapterId,
  lessonId,
}: LessonQuizProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const toggleEditing = () => setIsEditing((prev) => !prev);
  const form = useForm({
    resolver: zodResolver(
      zod.object({
        questions: zod.array(
          zod.object({
            id: zod.string(),
            question: zod.string(),
            options: zod.string(),
            answer: zod.string(),
            explanation: zod.string(),
            quizId: zod.string(),
            createdAt: zod.date(),
            updatedAt: zod.date(),
          })
        ),
      })
    ),
    defaultValues: {
      questions: quizzes?.questions ?? [],
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async () => {
    try {
      console.log(questions);
      toast.success("Lesson updated successfully");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const [questions, setQuestions] = useState<Question[]>([]);
  let newQuestion = {
    id: Math.random().toString(36).substring(7),
    question: "",
    options: `[{"id":"${Math.random()
      .toString(36)
      .substring(7)}","content": ""},{"id": "${Math.random()
      .toString(36)
      .substring(7)}","content": ""}]`,
    answer: "",
    explanation: "",
    quizId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Question;
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Lesson Quiz
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Quizzes
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        questions.length === 0 ? (
          <p className="text-sm text-slate-600">No questions yet.</p>
        ) : (
          <Accordion type="single" collapsible>
            {questions.map((question) => (
              <AccordionItem key={question.id} value={question.id}>
                <AccordionTrigger className="text-md">
                  {question.question}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-y-2">
                  {JSON.parse(question.options).map(
                    (option: { id: string; content: string }) => (
                      <div
                        key={option.id}
                        className="flex items-center gap-x-2"
                      >
                        {question.answer === option.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Dot className="h-4 w-4" />
                        )}
                        {option.content}
                      </div>
                    )
                  )}
                  <div className="flex items-center gap-x-2 text-slate-500">
                    <MessageCircleQuestionIcon className="h-4 w-4" />
                    {question.explanation}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            {questions.map((question) => (
              <div
                key={question.id}
                className="flex flex-col gap-y-2 bg-slate-200/40 p-4 rounded-md shadow-sm"
              >
                <div className="flex items-center gap-x-2">
                  <Input
                    type="text"
                    className="text-md font-[500] mt-2"
                    name={`questions[${question.id}].question`}
                    placeholder="Question"
                    onChange={(e) => {
                      question.question = e.target.value;
                    }}
                    defaultValue={question.question}
                    required
                  />
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setQuestions((prev) =>
                        prev.filter((q) => q.id !== question.id)
                      );
                    }}
                    className="w-min"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                {JSON.parse(question.options).map(
                  (option: { id: string; content: string | undefined }) => (
                    <div
                      key={option.id}
                      className="flex items-center gap-x-2 mx-6"
                    >
                      <Input
                        type="radio"
                        className="w-4 h-4"
                        name={`questions[${question.id}].answer`}
                        value={option.id}
                        onChange={(e) => {
                          question.answer = e.target.value;
                        }}
                        defaultChecked={question.answer === option.id}
                        required
                      />
                      <Input
                        type="text"
                        name={`questions[${question.id}].options[${option.id}].content`}
                        placeholder="Option"
                        defaultValue={option.content}
                        required
                        onChange={(e) => {
                          question.options = JSON.stringify(
                            JSON.parse(question.options).map(
                              (o: { id: string; content: string }) =>
                                o.id === option.id
                                  ? { ...o, content: e.target.value }
                                  : o
                            )
                          );
                        }}
                      />
                      {JSON.parse(question.options).length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            let result = JSON.stringify(
                              JSON.parse(question.options).filter(
                                (o: { id: string }) => o.id !== option.id
                              )
                            );
                            setQuestions((prev) =>
                              prev.map((q) =>
                                q.id === question.id
                                  ? { ...q, options: result }
                                  : q
                              )
                            );
                          }}
                          className="w-min"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )
                )}
                {JSON.parse(question.options).length < 4 && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        let result = JSON.stringify(
                          JSON.parse(question.options).concat({
                            id: Math.random().toString(36).substring(7),
                            content: "",
                          })
                        );
                        setQuestions((prev) =>
                          prev.map((q) =>
                            q.id === question.id ? { ...q, options: result } : q
                          )
                        );
                      }}
                      className="w-min flex items-center gap-x-2"
                    >
                      <Plus className="h-4 w-4" /> Add Option
                    </Button>
                  </div>
                )}
                <Textarea
                  className="text-sm mt-2"
                  name={`questions[${question.id}].explanation`}
                  placeholder="Explanation"
                  onChange={(e) => {
                    question.explanation = e.target.value;
                  }}
                />
              </div>
            ))}
            {questions.length < 5 && (
              <div className="flex items-center gap-x-2">
                <Button
                  type="button"
                  variant="default"
                  className="w-full"
                  onClick={() => {
                    setQuestions((prev) => [...prev, newQuestion]);
                  }}
                >
                  Add Question
                </Button>
              </div>
            )}
            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
