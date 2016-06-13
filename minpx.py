import os, fnmatch, re


def findReplace(directory, find, replace, filePattern):
  for path, dirs, files in os.walk(os.path.abspath(directory)):
    print path
    for filename in fnmatch.filter(files, filePattern):
      filepath = os.path.join(path, filename)
      with open(filepath) as f:
        s = f.read()

      s = re.sub(find, replace, s)
      print s
      with open(filepath, "w") as f:
        f.write(s)


if __name__ == "__main__":

  findReplace("/Users/ruslan/Work/Trendever/website/src",
              r"([0-9\.]+)px",
              lambda match: "{0}px".format(
                float(match.group(1)) / 2.34375
              ),
              '*.pcss')
