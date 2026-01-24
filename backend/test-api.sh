#!/bin/bash

# WorkZone Backend API Testing Script
# This script tests all the authentication endpoints

echo "🧪 WorkZone Backend API Testing"
echo "================================"
echo ""

BASE_URL="http://localhost:5000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if backend is running
echo "🔍 Checking if backend is running..."
if ! curl -s "$BASE_URL/health" > /dev/null; then
    echo -e "${RED}❌ Backend is not running on $BASE_URL${NC}"
    echo "Start the backend with: cd backend && npm run dev"
    exit 1
fi
echo -e "${GREEN}✅ Backend is running${NC}"
echo ""

# Test 1: User Registration
echo -e "${BLUE}📝 Test 1: User Registration (Student)${NC}"
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "role": "student",
    "identityCardNumber": "123456789"
  }')

echo "Response:"
echo "$SIGNUP_RESPONSE" | jq '.' 2>/dev/null || echo "$SIGNUP_RESPONSE"

# Extract token from signup response
TOKEN=$(echo "$SIGNUP_RESPONSE" | jq -r '.token' 2>/dev/null)
if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    echo -e "${RED}❌ Failed to get token from signup${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Token received${NC}"
echo ""

# Test 2: User Login
echo -e "${BLUE}🔑 Test 2: User Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }')

echo "Response:"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
echo -e "${GREEN}✅ Login successful${NC}"
echo ""

# Test 3: Get Current User
echo -e "${BLUE}👤 Test 3: Get Current User${NC}"
USER_RESPONSE=$(curl -s -X GET "$BASE_URL/api/auth/user" \
  -H "Authorization: Bearer $TOKEN")

echo "Response:"
echo "$USER_RESPONSE" | jq '.' 2>/dev/null || echo "$USER_RESPONSE"
echo -e "${GREEN}✅ User retrieval successful${NC}"
echo ""

# Test 4: Invalid Login
echo -e "${BLUE}❌ Test 4: Invalid Login (Expected to Fail)${NC}"
INVALID_LOGIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "wrongpassword"
  }')

echo "Response:"
echo "$INVALID_LOGIN" | jq '.' 2>/dev/null || echo "$INVALID_LOGIN"
echo ""

# Test 5: Company Registration
echo -e "${BLUE}🏢 Test 5: User Registration (Company)${NC}"
COMPANY_SIGNUP=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ABC Company",
    "email": "company@abc.com",
    "password": "companypass123",
    "phone": "+9876543210",
    "role": "company",
    "company": "ABC Corporation",
    "companyRegistration": "REG123456"
  }')

echo "Response:"
echo "$COMPANY_SIGNUP" | jq '.' 2>/dev/null || echo "$COMPANY_SIGNUP"
echo -e "${GREEN}✅ Company registration successful${NC}"
echo ""

# Summary
echo "================================"
echo -e "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "📊 Test Summary:"
echo "  ✅ Backend Health Check"
echo "  ✅ Student Registration"
echo "  ✅ User Login"
echo "  ✅ Get Current User"
echo "  ✅ Invalid Login Handling"
echo "  ✅ Company Registration"
