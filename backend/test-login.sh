#!/bin/bash

# Test Login Authentication
# This script tests if password verification is working correctly

BASE_URL="http://localhost:5000/api/auth"

echo "================================"
echo "Testing Login Authentication"
echo "================================"
echo ""

# First, create a test user
echo "1. Creating test user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "correctPassword123",
    "role": "student"
  }')

echo "Registration response:"
echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""
echo "---"
echo ""

# Test with correct password
echo "2. Testing login with CORRECT password..."
LOGIN_CORRECT=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "correctPassword123"
  }')

echo "Response:"
echo "$LOGIN_CORRECT" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_CORRECT"
echo ""

if echo "$LOGIN_CORRECT" | grep -q '"success":true'; then
  echo "✅ PASS: Login successful with correct password"
else
  echo "❌ FAIL: Login failed with correct password"
fi
echo ""
echo "---"
echo ""

# Test with wrong password
echo "3. Testing login with WRONG password..."
LOGIN_WRONG=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongPassword456"
  }')

echo "Response:"
echo "$LOGIN_WRONG" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_WRONG"
echo ""

if echo "$LOGIN_WRONG" | grep -q '"success":false'; then
  echo "✅ PASS: Login rejected with wrong password"
else
  echo "❌ FAIL: Login accepted with wrong password (SECURITY ISSUE!)"
fi
echo ""
echo "---"
echo ""

echo "================================"
echo "Test Complete"
echo "================================"
