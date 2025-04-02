import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ForumContent from "./ForumContent";
import { BrowserRouter } from "react-router";

const fakePosts = [
  {
    postId: 1,
    title: "Test Post 1",
    type: "Training",
    description: "Description 1",
    occurrenceDate: new Date("2023-03-01T10:00:00Z").toISOString(),
    likeCount: 0,
    liked: false,
    feedbackCount: 2,
  },
  {
    postId: 2,
    title: "Test Post 2",
    type: "Fundraiser",
    description: "Description 2",
    occurrenceDate: new Date("2023-03-02T10:00:00Z").toISOString(),
    likeCount: 5,
    liked: true,
    feedbackCount: 3,
  },
];

const fetchPostsDataMock = vi.fn();
const resetFiltersMock = vi.fn();

vi.mock("@/hooks/useForumPosts", () => {
  return {
    default: () => ({
      posts: fakePosts,
      loading: false,
      error: null,
      fetchPostsData: fetchPostsDataMock,
      resetFilters: resetFiltersMock,
    }),
  };
});

const likePostMock = vi.fn();
const unlikePostMock = vi.fn();
vi.mock("@/hooks/usePostLike", () => {
  return {
    usePostLike: () => ({
      likePost: likePostMock,
      unlikePost: unlikePostMock,
    }),
  };
});

vi.mock("@/services/cookiesService", () => ({
  getCookies: () => ({ accountId: 1 }),
}));

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../ui/back-button", () => ({
  default: () => <div data-testid="back-button">Back Button</div>,
}));
vi.mock("./Filters", () => ({
  default: () => <div data-testid="filters">Filters Component</div>,
}));

describe.skip("ForumContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders forum content with posts", async () => {
    render(
      <BrowserRouter>
        <ForumContent />
      </BrowserRouter>,
    );
    expect(screen.getByText("Forum")).toBeInTheDocument();
    expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    expect(screen.getByText("Test Post 2")).toBeInTheDocument();
  });

  it("navigates to PostDetailPage when a post card is clicked", async () => {
    render(
      <BrowserRouter>
        <ForumContent />
      </BrowserRouter>,
    );
    const postTitle = screen.getByText("Test Post 1");
    fireEvent.click(postTitle);
    expect(mockNavigate).toHaveBeenCalledWith("/pages/PostDetailPage", {
      state: { postId: 1 },
    });
  });

  it("handles like button click correctly for liking a post", async () => {
    render(
      <BrowserRouter>
        <ForumContent />
      </BrowserRouter>,
    );
    const likeButton = screen.getByText("0").closest("button");
    expect(likeButton).toBeInTheDocument();
    if (likeButton) {
      fireEvent.click(likeButton);
    }
    expect(likePostMock).toHaveBeenCalledWith(1, 1);
  });

  it("handles like button click correctly for unliking a post", async () => {
    render(
      <BrowserRouter>
        <ForumContent />
      </BrowserRouter>,
    );
    const likeButton = screen.getByText("5").closest("button");
    expect(likeButton).toBeInTheDocument();
    if (likeButton) {
      fireEvent.click(likeButton);
    }
    expect(unlikePostMock).toHaveBeenCalledWith(2, 1);
  });
});
