"use client";
import React, { Suspense } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  tv,
  useCheckbox,
  VisuallyHidden,
  Chip,
  CheckboxIcon,
  Input,
  Button,
  Spinner,
} from "@nextui-org/react";
import { RepoCards, UserRepoCards } from "./cards";
import { BiGitRepoForked } from "react-icons/bi";
import RepoDropdown from "./repo-dropdown";

export default function TypeTabs() {
  let tabs = [
    {
      id: "Contributors",
      label: "Contribute to Open Source",
      description:
        "Repositories that are looking for contributors to contribute to their projects.",
      children: <ContributorElements />,
      repos: (
        <Suspense fallback={<Spinner />}>
          <RepoCards />
        </Suspense>
      ),
    },
    {
      id: "Creators",
      label: "Creator Repos",
      description: "Repository of the creators of Open Spacelink.",
      children: <CreatorElements />,
      repos: <UserRepoCards />,
    },
  ];

  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Dynamic tabs" size="lg">
        <Tab key={tabs[0].id} title={tabs[0].id}>
          <h3 className="text-xl font-semibold text-blue-400">
            {tabs[0].label}
          </h3>
          <p>{tabs[0].description}</p>
          {tabs[0].children}
          <div className="mt-4">{tabs[0].repos}</div>
        </Tab>
        <Tab key={tabs[1].id} title={tabs[1].id}>
          <h3 className="text-xl font-semibold text-blue-400">
            {tabs[1].label}
          </h3>
          <p>{tabs[1].description}</p>
          {tabs[1].children}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {tabs[1].repos}
            <div className="">
              <Card className="h-[400px]">
                <CardHeader title="Add a new repository" />
                <CardBody className="flex justify-center items-center gap-2">
                  <h3 className="text-lg">Add a new repository</h3>
                  <p className="text-sm text-zinc-300 text-center">
                    Share a repo now to show your creations and gain support
                    from other Contributors!
                  </p>
                  <Suspense
                    fallback={
                      <div>
                        <Spinner />
                      </div>
                    }
                  >
                    <RepoDropdown />
                  </Suspense>
                </CardBody>
              </Card>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

const ContributorElements = () => {
  const languages = [
    {
      value: "Javascript",
      label: "Javascript",
    },
    {
      value: "React",
      label: "React",
    },
    {
      value: "Svelte",
      label: "Svelte",
    },
    {
      value: "Typescript",
      label: "Typescript",
    },
    {
      value: "Python",
      label: "Python",
    },
    {
      value: "Ruby",
      label: "Ruby",
    },
  ];
  return (
    <div className="mt-3 grid grid-cols-3 gap-3">
      <Input
        placeholder="Search for a repository"
        className="cols-span-2"
        size="lg"
      />
      <Select
        items={languages}
        label="Choose a language"
        placeholder="Select a language"
        className="max-w-xs"
        size="sm"
      >
        {(programmingLanguage) => (
          <SelectItem key={programmingLanguage.value}>
            {programmingLanguage.label}
          </SelectItem>
        )}
      </Select>
    </div>
  );
};

const checkbox = tv({
  slots: {
    base: "border-default  hover:bg-default-200 rounded-lg ",
    content: "text-default-500",
  },
  variants: {
    isSelected: {
      true: {
        base: "border-primary bg-primary rounded-lg hover:bg-primary-500 hover:border-primary-500 ",
        content: "text-primary-foreground pl-1",
      },
    },
    isFocusVisible: {
      true: {
        base: "outline-none ring-2 ring-focus rounded-lg ring-offset-2 ring-offset-background",
      },
    },
  },
});

const CreatorElements = () => {
  const options = [
    {
      title: "Beginner Friendly",
      icon: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
      title: "Mentorship Available",
      icon: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
      title: "Good First Issue",
      icon: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
  ];

  const languages = [
    {
      value: "Javascript",
      label: "Javascript",
    },
    {
      value: "React",
      label: "React",
    },
    {
      value: "Svelte",
      label: "Svelte",
    },
    {
      value: "Typescript",
      label: "Typescript",
    },
    {
      value: "Python",
      label: "Python",
    },
    {
      value: "Ruby",
      label: "Ruby",
    },
  ];
  return (
    <div className="mt-3 flex gap-4">
      <Input
        placeholder="Search for a repository"
        className="cols-span-2"
        size="lg"
      />
      <Select
        items={languages}
        label="Choose a language"
        placeholder="Select a language"
        className="max-w-xs"
        size="sm"
      >
        {(programmingLanguage) => (
          <SelectItem key={programmingLanguage.value}>
            {programmingLanguage.label}
          </SelectItem>
        )}
      </Select>
      {options.map((option, i) => (
        <CustomCheckBox key={i}>{option.title}</CustomCheckBox>
      ))}
    </div>
  );
};

const CustomCheckBox = ({ children }) => {
  const {
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    defaultSelected: true,
  });
  const styles = checkbox({ isSelected, isFocusVisible });
  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Chip
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        color="primary"
        startContent={isSelected ? <CheckboxIcon className="ml-1" /> : null}
        variant="faded"
        {...getLabelProps()}
      >
        {children ? children : isSelected ? "Enabled" : "Disabled"}
      </Chip>
    </label>
  );
};
