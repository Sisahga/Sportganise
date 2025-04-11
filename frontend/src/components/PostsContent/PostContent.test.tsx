import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import PostsContent from "./PostsContent";

const mockPost = {
  postId: 1,
  title: "Test Post Title",
  creationDate: new Date().toISOString(),
  description: "Test post description",
  liked: false,
  likeCount: 0,
  feedbackList: [
    {
      feedbackId: 1,
      author: {
        accountId: 123,
        name: "John Doe",
        type: "player",
        pictureUrl: "",
      },
      description: "Test feedback",
      creationDate: new Date().toISOString(),
    },
  ],
};

const mockUser = {
  accountId: 123,
  firstName: "John",
  lastName: "Doe",
  type: "player",
  pictureUrl: "",
};

const usePostMock = vi.fn();
vi.mock("@/hooks/usePost", () => ({
  usePost: (postId: number) => usePostMock(postId),
}));

const likePostMock = vi.fn();
const unlikePostMock = vi.fn();
vi.mock("@/hooks/usePostLike", () => ({
  usePostLike: () => ({
    likePost: likePostMock,
    unlikePost: unlikePostMock,
  }),
}));

const addFeedbackMock = vi.fn();
const deleteFeedbackMock = vi.fn();
vi.mock("@/hooks/useFeedback", () => ({
  useFeedback: () => ({
    addFeedback: addFeedbackMock,
    deleteFeedback: deleteFeedbackMock,
  }),
}));

vi.mock("@/services/cookiesService", () => ({
  getCookies: () => mockUser,
}));

vi.mock("loglevel", () => ({
  error: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
}));

describe.skip("PostsContent", () => {
  beforeEach(() => {
    usePostMock.mockReset();
    usePostMock.mockReturnValue({
      post: mockPost,
      loading: false,
      error: null,
    });
  });

  it("renders post content correctly", () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/", state: { postId: 1 } }]}>
        <PostsContent />
      </MemoryRouter>,
    );
    expect(screen.getByText(mockPost.title)).toBeTruthy();
    expect(screen.getByText(mockPost.description)).toBeTruthy();
    expect(screen.getByText(String(mockPost.likeCount))).toBeTruthy();
  });

  it("shows loading state", () => {
    usePostMock.mockReturnValue({
      post: null,
      loading: true,
      error: null,
    });
    render(
      <MemoryRouter initialEntries={[{ pathname: "/", state: { postId: 1 } }]}>
        <PostsContent />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Loading post.../i)).toBeTruthy();
  });

  it("shows error state", () => {
    usePostMock.mockReturnValue({
      post: null,
      loading: false,
      error: "Error",
    });
    render(
      <MemoryRouter initialEntries={[{ pathname: "/", state: { postId: 1 } }]}>
        <PostsContent />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Error loading post/i)).toBeTruthy();
  });
});
