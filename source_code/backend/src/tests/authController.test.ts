// import { Request, Response } from "express";
// import { login } from "./authController";
// import { userService } from "../services/userService";
// import { generateToken } from "../utils/jwt";
// import { customLogger } from "../utils/logger";
// import { CustomRequest } from "../types";

// // Mock dependencies
// jest.mock("../services/userService");
// jest.mock("../utils/jwt");
// jest.mock("../utils/logger");

// describe("Auth Controller - login", () => {
//   let mockRequest: Partial<CustomRequest>;
//   let mockResponse: Partial<Response>;

//   beforeEach(() => {
//     mockRequest = {
//       body: {
//         usernameOrEmail: "testuser",
//         password: "password123",
//       },
//     };

//     mockResponse = {
//       status: jest.fn().mockReturnThis(),
//       setHeader: jest.fn().mockReturnThis(),
//       json: jest.fn().mockReturnThis(),
//     };

//     jest.clearAllMocks();
//   });

//   test("should successfully login user and return token", async () => {
//     const mockUser = {
//       _id: "123",
//       fullname: "Test User",
//       username: "testuser",
//       email: "test@example.com",
//       userRole: "user",
//     };

//     const mockToken = "mock-token-123";

//     (userService.login as jest.Mock).mockResolvedValue(mockUser);
//     (generateToken as jest.Mock).mockReturnValue(mockToken);

//     await login(mockRequest as CustomRequest, mockResponse as Response);

//     expect(mockResponse.status).toHaveBeenCalledWith(200);
//     expect(mockResponse.setHeader).toHaveBeenCalledWith("Authorization", `Bearer ${mockToken}`);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         data: { user: mockUser },
//       })
//     );
//   });

//   test("should handle login failure", async () => {
//     const errorMessage = "Invalid credentials";
//     (userService.login as jest.Mock).mockRejectedValue(new Error(errorMessage));

//     await login(mockRequest as CustomRequest, mockResponse as Response);

//     expect(mockResponse.status).toHaveBeenCalledWith(400);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         error: expect.objectContaining({
//           message: expect.stringContaining("user login failed"),
//         }),
//       })
//     );
//   });

//   test("should handle missing credentials", async () => {
//     mockRequest.body = {};

//     await login(mockRequest as CustomRequest, mockResponse as Response);

//     expect(mockResponse.status).toHaveBeenCalledWith(400);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         error: expect.any(Object),
//       })
//     );
//   });
// });
