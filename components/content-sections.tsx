"use client"

import { ScrollRevealSection } from "./scroll-reveal-section"
import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence } from "framer-motion"

export function ContentSections() {
  const { t } = useLanguage()

  const sections = [
    {
      title: t("about.problemSolver.title"),
      content: t("about.problemSolver.content"),
    },
    {
      title: t("about.changeMaker.title"),
      content: t("about.changeMaker.content"),
    },
    {
      title: t("about.designChampion.title"),
      content: t("about.designChampion.content"),
    },
  ]

  return (
    <section id="about" className="py-24 px-4 bg-card">
      <div className="mx-auto max-w-4xl space-y-12">
        <ScrollRevealSection>
          <AnimatePresence mode="wait">
            <motion.h2
              key={t("about.title")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-semibold pb-8"
            >
              {t("about.title")}
            </motion.h2>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={t("about.intro")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xl mb-4"
            >
              {t("about.intro")}
            </motion.p>
          </AnimatePresence>
        </ScrollRevealSection>
        {sections.map((section, index) => (
          <ScrollRevealSection key={section.title} delay={index * 0.1}>
            <article className="relative pl-8 border-l-2 border-primary/30 ">
              <AnimatePresence mode="wait">
                <motion.h3
                  key={section.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-semibold mb-4"
                >
                  {section.title}
                </motion.h3>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.p
                  key={section.content}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-muted-foreground leading-relaxed text-lg"
                >
                  {section.content}
                </motion.p>
              </AnimatePresence>
            </article>
          </ScrollRevealSection>
        ))}
        <AnimatePresence mode="wait">
          <motion.a
            key={t("about.workWithMe")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            href="mailto:santireke37@gmail.com"
            className="flex w-fit mx-auto mt-4 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent py-5 px-12 text-sm font-medium text-primary-foreground transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
          >
            {t("about.workWithMe")}
          </motion.a>
        </AnimatePresence>
      </div>
    </section>
  )
}
