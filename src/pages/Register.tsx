
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Get started with our insurance services</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Registration form will be implemented in next step */}
          <p className="text-center text-sm text-muted-foreground">Coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
